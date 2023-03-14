const Poll = require("../model/Poll.model");
const { v4: uuidv4 } = require("uuid");
const PollOptionsService = require("../../poll_options/services/poll_options.services");
const ApiError = require("../../../utils/apiError");
const CategoriesService = require("../../categories/services/categories.service");
const CategoryPollServices = require("../../category_poll/services/category_poll.service");
const PollDurationServices = require("../../poll_duration/services/poll_duration.service");
const TimeUtils = require("../../../utils/timeUtils");
const UserPollsService = require("../../user_polls/services/user_polls.service");
const PollOptionsServices = require("../../poll_options/services/poll_options.services");
const UserPolls = require("../../user_polls/model/User_polls.model");
const setEndDate = require("../../../utils/endDate");
// const { knex } = require("../model/Poll.model");
const knex = require("../../../config/db.config")

class PollService {
    async getPollDurations(pollArr) {
        let polls = [];
        for await (const poll of pollArr) {
            const id = poll.duration;
            poll.duration = await PollDurationServices.getOne(id);
            polls.push(poll);
        }
        return polls;
    }

    // Formatting poll details by removing unwanted data and adding required data:
    async formatPolls(polls) {
        if (!Array.isArray(polls)) {
            polls = await this.formatOnePoll(polls)
            return polls;
        }

        let newPolls = [];
        for await (let poll of polls) {
            poll = await this.formatOnePoll(poll);
            newPolls.push(poll);
        }

        return newPolls;
    }

    async formatOnePoll(poll) {
        const { activity_id, category_id, modified_by, modified_at, is_deleted, ...newPoll } = poll;

        newPoll.poll_option = newPoll.poll_option?.map((option) => {
            const { poll_id, created_at, modified_at, is_deleted, ...newOption } = option;
            return newOption;
        })

        newPoll.category = newPoll.category?.map((category) => {
            const { created_at, modified_at, status, is_deleted, ...newCategory } = category;
            return newCategory;
        })

        delete newPoll.activity.created_at;
        delete newPoll.activity.modified_at;
        delete newPoll.activity.status;
        delete newPoll.activity.is_deleted;

        // Add duration details instead of only id:
        newPoll.duration = await PollDurationServices.getOne(newPoll.duration_id);
        delete newPoll.duration_id;
        delete newPoll.duration.created_at;
        delete newPoll.duration.modified_at;
        delete newPoll.duration.status;
        delete newPoll.duration.is_deleted;

        return newPoll;
    }

    async getAll(user) {
        // let polls = [];
        // If superadmin:
        if (user.role_id === 1) {
            let polls = await Poll.query().where("is_deleted", "=", 0).withGraphFetched({ category: true, poll_option: true, activity: true });
            polls = await this.formatPolls(polls);
            return polls;
        }

        const campaignPolls = await this.getByCampaignId(user.campaign_id);
        campaignPolls = await this.formatPolls(campaignPolls);
        return campaignPolls;
    }

    async getByCampaignId(campaign_id) {
        let polls = await Poll.query()
            .where("campaign_id", "=", campaign_id)
            .where("is_deleted", "=", 0)
            .withGraphFetched({ category: true, poll_option: true, activity: true });

        polls = await this.formatPolls(polls);
        return polls;
    }

    async getOne(id) {
        let poll = await Poll.query()
            .findById(id)
            .where("is_deleted", "=", 0)
            .withGraphFetched({ category: true, poll_option: true, activity: true });

        // if (!poll)
        //     throw ApiError.notFound("Poll not found");

        // Poll result:
        if (poll) {
            poll.result = await this.getPollResults(id);
            poll = await this.formatOnePoll(poll);
        }

        return poll;
    }

    async getYearlyPoll(category_id) {
        // Yealy poll check is missing        
        const polls = await Poll.query()
            .where("category_id", "=", category_id)
            .where("is_deleted", "=", 0);

        for await (const poll of polls) {
            poll.duration = await PollDurationServices.getOne(poll.duration);
        }

        return polls;
    }

    async getPollOfTheDay(category_id, campaign_id) {
        const today = this.todayDate();
        if (campaign_id && category_id) {
            const poll = await Poll.query()
                .where("campaign_id", "=", campaign_id)
                .where("category_id", "=", category_id)
                .where("start_date", "=", today)
                .where("is_deleted", "=", 0);

            return poll;
        }
        if (campaign_id && !category_id) {
            const poll = await Poll.query()
                .where("campaign_id", "=", campaign_id)
                .where("start_date", "=", today)
                .where("is_deleted", "=", 0);

            return poll;
        }
    }

    async previousPolls(category_id) {
        const today = TimeUtils.date();

        const polls = await Poll.query()
            .select("id", "poll_name")
            .where("category_id", "=", category_id)
            .where("end_date", "<", today)
            .where("is_deleted", "=", 0);


        if (!polls.length)
            throw ApiError.notFound("No previous polls found in this category!");

        return polls;
    }

    async newPoll(data, options) {
        // validation of required data: activity_id, poll_name, campaign_id, campaign_name, question, duration_id, start_date
        const { activity_id, poll_name, campaign_id, campaign_name, question, duration_id, start_date } = data;
        if (!activity_id || !poll_name || !campaign_id || !campaign_name || !question || !duration_id || !start_date)
            throw ApiError.badRequest("Insufficient data to create poll");

        data.id = uuidv4();
        // Set end date to data:
        data = setEndDate(data);

        // Check if this campaign (except Plutos One) has already Poll of the Day on this date:
        if (duration_id === "1" && (data.campaign_name !== "Plutos One")) {  // Replace campaign_name with campaign_id
            const fetchPOTD = await this.fetchCampaignDailyPoll(campaign_id, start_date);
            if (fetchPOTD)
                throw ApiError.alreadyExists(`This campaign has already Poll of the Day on this date: ${start_date}`);
        }

        // Check if yearly poll already exsits:
        // Code here...

        const newPoll = await Poll.query().insert(data);

        const insertOptions = await PollOptionsService.newOptions(newPoll.id, options);

        return data = {
            poll: newPoll,
            options: insertOptions
        };
    }

    async fetchCampaignDailyPoll(campaign_id, start_date) {
        const poll = await Poll.query().findOne({
            campaign_id: campaign_id,
            duration_id: 1,
            start_date: start_date,
            status: true,
            is_deleted: false
        });

        return poll;
    }

    async getPollByPlutosCampaign(campaign_id, category_id, start_date) {
        const fetchPoll = await Poll.query().findOne({
            campaign_id: campaign_id,
            category_id: category_id,
            start_date: start_date
        });

        return fetchPoll;
    }

    async getPollByCampaignStartDate(campaign_id, start_date) {
        const poll = await Poll.query().findOne({ campaign_id: campaign_id, start_date })

        return poll;
    }

    async updatePoll(data, options) {
        const { id } = data;
        delete data.id;
        delete data.option_name;

        const poll = await this.getOne(id);
        if (!poll)
            throw ApiError.notFound("Poll not found");

        await Poll.query()
            .findById(id)
            .patch(data);

        const optionsLength = Object.keys(options).length;
        if (optionsLength)
            await PollOptionsService.updateOptions(id, options);

        const updatedPoll = await this.getOne(id);
        delete updatedPoll.result;

        return updatedPoll;
    }

    async deletePoll(id) {
        const poll = await this.getOne(id);
        if (!poll)
            throw ApiError.notFound("Poll not found");

        await Poll.query()
            .findById(id)
            .patch({
                is_deleted: true
            });

        await PollOptionsService.deleteOptions(id);

        return true;
    }

    async getPollResults(poll_id) {
        const totalPollResponses = await UserPollsService.pollResponses(poll_id);
        const pollOptions = await PollOptionsServices.getOptions(poll_id);
        let arr = [];
        for await (const option of pollOptions) {
            const users = await UserPolls.query()
                .where("poll_id", "=", poll_id)
                .where("option_id", "=", option.id);

            const percentage = users.length ? ((users.length / totalPollResponses.length) * 100).toPrecision(4) : 0;
            const total_users = percentage + "%";

            let obj = {
                option_id: option.id,
                option_name: option.option,
                option_img: option.option_image,
                total_users: total_users
            }
            arr.push(obj);
        }

        const result = {
            poll_id: poll_id,
            total_responses: totalPollResponses.length,
            options: arr
        }

        return result;
    }

    async pollByDuration(campaign_id, duration_name) {
        const duration = await PollDurationServices.findDurationId(duration_name);
        if (!duration)
            throw ApiError.notFound("Incorrect duration format");

        const { id: duration_id } = duration;
        const start_date = TimeUtils.getDate();
        let end_date;

        // Switch case:
        /* switch (duration_id) {
            case 1:
                const end_date = TimeUtils.nextDay()

                console.log("End", end_date);
                let poll = await Poll.query().toLowerCase()
                    .where("campaign_id", "=", campaign_id)
                    .where("duration_id", "=", duration[0]?.id)
                    .where(duration => duration.where("start_date", "=", start_date).orWhere("start_date", ">", start_date))
                    .where("end_date", "<", end_date)
                    .where("status", "=", 1)
                    .where("is_deleted", "=", 0)
                    .withGraphFetched({ poll_option: true, activity: true })

                if (poll.length)
                    poll[0].result = await this.getPollResults(poll[0].id);
                return poll;
            default:
                break;
        } */

        if (duration_name === "daily")
            end_date = TimeUtils.nextDayQuery()

        let poll = await Poll.query().findOne({
            campaign_id: campaign_id,
            duration_id: duration_id,
            status: true,
            is_deleted: false
        }).where(duration => duration.where("start_date", "=", start_date).orWhere("start_date", ">", start_date))
            .where("end_date", "<", end_date)
            .withGraphFetched({ poll_option: true, activity: true, category: true })

        // console.log("Poll", poll);
        if (!poll)
            throw ApiError.notFound(`Poll (${duration_name}) not found`);
        // if (poll)
        poll.result = await this.getPollResults(poll.id);

        poll = await this.formatOnePoll(poll);
        return poll;
    }

    async durations() {
        const query = "SELECT id, duration FROM poll_duration WHERE is_deleted = 0 AND status = 1";
        const [durations, fields] = await knex.raw(query);

        return durations;
    }
}

module.exports = new PollService();