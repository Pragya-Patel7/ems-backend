const Poll = require("../model/Poll.model");
const { v4: uuidv4 } = require("uuid");
const PollOptionsService = require("../../poll_options/services/poll_options.services");
const ApiError = require("../../../utils/apiError");
const CategoriesService = require("../../categories/services/categories.service");
const CategoryPollServices = require("../../category_poll/services/category_poll.service");
const PollDurationServices = require("../../poll_duration/services/poll_duration.service");

class PollService {
    async getPollDurations(pollArr) {
        let polls = [];
        for await(const poll of pollArr) {
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

    async getOne(id) {
        const poll = await Poll.query()
            .findById(id)
            .where("is_deleted", "=", 0)
            .withGraphFetched({ category: true, poll_option: true });

        if (!poll)
            throw ApiError.notFound("Poll not found");

        const durationId = poll.duration;
        const duration = await PollDurationServices.getOne(durationId);

        poll.duration = duration;

        return poll;
    }

    async newPoll(data, options) {
        data.id = uuidv4();
        data.yearly = Boolean(data.yearly);
    
        const duration = await PollDurationServices.getAll();
        let dailyDurationId;
        let yearlyDurationId;
        duration.map(dur => {
            if (dur.duration == "Daily")
                dailyDurationId = dur.id;
            
            if (dur.duration == "Yearly")
                yearlyDurationId = dur.id;            
        })

        if (data.yearly)
            data.duration = yearlyDurationId;
        else
            data.duration = dailyDurationId;

        const newPoll = await Poll.query().insert(data);

        const insertOptions = await PollOptionsService.newOptions(newPoll.id, options);

        return data = {
            poll: newPoll,
            options: insertOptions
        };
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
}

module.exports = new PollService();