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

    // async getAll() {
    //     const polls = await Poll.query().where("is_deleted", "=", 0).withGraphFetched({ category: true, poll_option: true, activity: true });
    //     // const allPolls = await this.getPollDurations(polls);

    //     return polls;
    // }

    async getAll(user) {
        // if campaign is Plutos ONE, show all polls OR show polls based on user's role (Super admin or admin):
        if (user.campaign_id === 1) {
            const polls = await Poll.query().where("is_deleted", "=", 0).withGraphFetched({ category: true, poll_option: true, activity: true });
            return polls;
        }
                    
        // Polls by campaign id:
        // campaign_id = campaign_id.replace(/['"]+/g, '');
        const campaignPolls = await this.getByCampaignId(user.campaign_id);
        return campaignPolls;
    }

    async getByCampaignId(campaign_id) {
        // if, super-admin, show all polls
        /**Code here */
        // req.user : user details
        //

        // If, not super-admin:
        const polls = await Poll.query()
            .where("campaign_id", "=", campaign_id)
            .where("is_deleted", "=", 0)
            .withGraphFetched({ category: true, poll_option: true, activity: true });

        // console.log("Polls", polls);
        // const allPolls = await this.getPollDurations(polls);

        return polls;
    }

    async getOne(id) {
        let poll = await Poll.query()
            .findById(id)
            .where("is_deleted", "=", 0)
            .withGraphFetched({ category: true, poll_option: true, activity: true });

        // Poll result:
        // console.log(">>>", poll);
        // const result = await this.getPollResults(id);
        // console.log(">>>", result);
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

    todayDate() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const date = new Date().getDate();

        return `${year}-${month + 1}-${date}`;
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
        const today = this.todayDate();

        const polls = await Poll.query()
            .select("id", "poll_name")
            .where("category_id", "=", category_id)
            .where("start_date", "<", today)
            .where("is_deleted", "=", 0);


        return polls;
    }

    async newPoll(data, options) {
        // validation of required data: activity_id, poll_name, campaign_id, campaign_name, question, duration_id, start_date
        const { activity_id, poll_name, campaign_id, campaign_name, question, duration_id, start_date } = data;
        if (!activity_id || !poll_name || !campaign_id || /*!campaign_name ||*/ !question || !duration_id || !start_date)
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
        // Code here

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
        const poll = await this.getOne(poll_id);
        if (!poll)
            throw ApiError.notFound("Poll not found");

        const totalPollResponses = await UserPollsService.pollResponses(poll_id);
        console.log("Total", totalPollResponses);
        const pollOptions = await PollOptionsServices.getOptions(poll_id);
        console.log("options", pollOptions);
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
            poll_image: poll.image,
            question: poll.question,
            total_responses: totalPollResponses.length,
            options: arr
        }

        return result;
    }

    async pollByDuration(campaign_id, duration_name) {
        const duration = await PollDurationServices.findDurationId(duration_name);
        console.log("Duration", duration);
        if (!duration.length)
            throw ApiError.notFound("Incorrect duration format");

        const duration_id = duration[0].id;
        const start_date = TimeUtils.getDate();
        let end_date;

        // Switch case:
        // switch (duration_id) {
        //     case 1:
        //         const end_date = TimeUtils.nextDay()

        //         console.log("End", end_date);
        //         let poll = await Poll.query().toLowerCase()
        //             .where("campaign_id", "=", campaign_id)
        //             .where("duration_id", "=", duration[0]?.id)
        //             .where(duration => duration.where("start_date", "=", start_date).orWhere("start_date", ">", start_date))
        //             .where("end_date", "<", end_date)
        //             .where("status", "=", 1)
        //             .where("is_deleted", "=", 0)
        //             .withGraphFetched({ poll_option: true, activity: true })

        //         if (poll.length)
        //             poll[0].result = await this.getPollResults(poll[0].id);
        //         return poll;
        //     default:
        //         break;
        // }

        if (duration_name === "daily")
            end_date = TimeUtils.nextDayQuery()

        let poll = await Poll.query()
            .where("campaign_id", "=", campaign_id)
            .where("duration_id", "=", duration_id)
            .where(duration => duration.where("start_date", "=", start_date).orWhere("start_date", ">", start_date))
            .where("end_date", "<", end_date)
            .where("status", "=", 1)
            .where("is_deleted", "=", 0)
            .withGraphFetched({ poll_option: true, activity: true })

        // console.log("Poll", poll);
        if (poll.length)
            poll[0].result = await this.getPollResults(poll[0].id);
        return poll;
    }
}

module.exports = new PollService();