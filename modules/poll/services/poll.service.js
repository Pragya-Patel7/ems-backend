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

    async getAll() {
        const polls = await Poll.query().where("is_deleted", "=", 0).withGraphFetched({ category: true, poll_option: true });
        const allPolls = await this.getPollDurations(polls);

        return allPolls;
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
        const poll = await Poll.query()
            .findById(id)
            .where("is_deleted", "=", 0)
            .withGraphFetched({ category: true, poll_option: true });

        // const durationId = poll.duration;
        // const duration = await PollDurationServices.getOne(durationId);

        // poll.duration = duration;

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
        data.id = uuidv4();
        // validation in body: activity_id, poll_name, campaign_id, campaign_name, question, duration_id, start_date

        // console.log("Data", data);
        // If daily, set end date:
        if (data.duration_id === "1") {
            data.end_date = TimeUtils.nextDay();
        }

        // If yearly, set end date:




        // if (data.yearly === "true")
        //     data.yearly = true;
        // else
        //     data.yearly = false;

        // Finding yearly and daily duration id:
        // const duration = await PollDurationServices.getAll();
        // let dailyDurationId;
        // let yearlyDurationId;

        // for await (let dur of duration) {
        //     if (dur.duration === "Daily")
        //         dailyDurationId = dur.id;

        //     if (dur.duration === "Yearly") {
        //         yearlyDurationId = dur.id;
        //     }
        // }

        // // Adding duration in data before creating new poll:
        // if (data.yearly) {
        //     const category_id = data.category_id;
        //     const fetchYearlyPoll = await this.getYearlyPoll(category_id);
        //     if (fetchYearlyPoll.length)
        //         throw ApiError.alreadyExists("Yearly poll already exists in this category");

        //     data.duration = yearlyDurationId;
        // }
        // else
        //     data.duration = dailyDurationId;

        // delete data.yearly;
        // if (!data.category_id) {
        //     const fetchPoll = await this.getPollByCampaignStartDate(data.campaign_id, data.start_date);
        //     if (fetchPoll)
        //         throw ApiError.alreadyExists("Poll of the day already exists on this date");
        // }

        // if (data.campaign_id && data.category_id) {
        //     const fetchPoll = await this.getPollByPlutosCampaign(data.campaign_id, data.category_id, data.start_date);
        //     if (fetchPoll)
        //         throw ApiError.alreadyExists("Poll of the day already exists on this date");

        // }
        // console.log("Post>>>", data);
        const newPoll = await Poll.query().insert(data);

        const insertOptions = await PollOptionsService.newOptions(newPoll.id, options);

        return data = {
            poll: newPoll,
            options: insertOptions
        };
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
        // console.log(">>>", poll_id);
        const poll = await this.getOne(poll_id);
        if (!poll)
            throw ApiError.notFound("Poll not found");

        const totalPollResponses = await UserPollsService.pollResponses(poll_id);
        const pollOptions = await PollOptionsServices.getOptions(poll_id);
        let arr = [];
        for await (const option of pollOptions) {
            const users = await UserPolls.query()
                .where("poll_id", "=", poll_id)
                .where("option_id", "=", option.id);
			
			const percentage = users.length ? ((users.length / totalPollResponses.length)*100).toPrecision(4) : 0;
			// console.log("%%", percentage)
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
            end_date = TimeUtils.nextDayQuery();
		
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