const UserPolls = require("../model/User_polls.model");
const ApiError = require("../../../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const PollOptionsServices = require("../../poll_options/services/poll_options.services");
// const PollService = require("../../poll/services/poll.service");
const PollService = require("../../poll/services/poll.service");
const TimeUtils = require("../../../utils/timeUtils");

class UserPollsServices {
    async getAll() {
        const userPolls = await UserPolls.query().where("is_deleted", "=", 0);
        return userPolls;
    }

    async getById(id) {
        const userPoll = await UserPolls.query().findOne({ id: id });

        return userPoll;
    }
    async getUserAllPolls(user_id) {
        const userPoll = await UserPolls.query()
            .where("user_id", "=", user_id)
            .where("is_deleted", "=", 0);

        return userPoll;
    }

    async getUserOnePoll(user_id, poll_id) {
        const userPoll = await UserPolls.query().findOne({ user_id: user_id, poll_id: poll_id });

        console.log("User poll", userPoll);
        return userPoll;
    }

    async getUserPollById(id) {
        const userPoll = await UserPolls.query().findById(id);

        return userPoll;
    }


    // ==============x============= Need update: ==============x=============
    // async getUserPollOption(poll_id, option_id) {
    //     const users = await (await UserPolls.query()).find({ poll_id: poll_id, option_id: option_id });

    //     return users;
    // }

    async update(id, data) {
        const fetchPoll = await this.getById(id);
        if (!fetchPoll)
            throw ApiError.notFound("This user poll not found");

        const updatePoll = await fetchPoll.$query().patchAndFetch(data);

        return updatePoll;
    }

    async delete(id) {
        const data = { is_deleted: true };
        const deleteUserPoll = await this.update(id, data);

        return deleteUserPoll;
    }

    async create(data) {
        data.id = uuidv4();

        const fetchPollOption = await PollOptionsServices.getOptionDetails(data.option_id, data.poll_id);
        if (!fetchPollOption)
            throw ApiError.notFound("Incorrect poll id or option id!");

        const fetchPoll = await PollService.getOne(data.poll_id);
        if (!fetchPoll)
            throw ApiError.notFound("Poll not found");

        const newUserPoll = await UserPolls.query().insert({
            id: data.id,
            user_id: data.user_id,
            poll_id: data.poll_id,
            option_id: data.option_id,
        })

        newUserPoll.coin = fetchPoll.coin;

        return newUserPoll;
    }

    async getPollResults(poll_id) {
        console.log(">>>", poll_id);
        const poll = await PollService.getOne(poll_id);
        if (!poll)
            throw ApiError.notFound("Poll not found");

        const totalPollResponses = await this.pollResponses(poll_id);
        const pollOptions = await PollOptionsServices.getOptions(poll_id);
        let arr = [];
        for await (const option of pollOptions) {
            const users = await UserPolls.query()
                .where("poll_id", "=", poll_id)
                .where("option_id", "=", option.id);

            let obj = {
                option_id: option.id,
                option_name: option.option,
                option_img: option.option_image,
                total_users: ((users.length / totalPollResponses.length) * 100).toPrecision(4)+'%'
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

    async deleteUserPoll(userId, pollId, optionId) {
        const fetchOption = await UserPolls.query().findOne({
            user_id: userId,
            poll_id: pollId,
            option_id: optionId
        });

        if (!fetchOption)
            throw ApiError.notFound("This user with poll id and option id not found");

        await this.delete(fetchOption.id);

        return true;
    }

    async todayPolls(user_id) {
        const today = TimeUtils.getDate();
        const nextDay = TimeUtils.nextDayQuery();

        const fetchPolls = await UserPolls.query()
            .where("user_id", "=", user_id)
            .where(responed => responed.where("created_at", "=", today).orWhere("created_at", ">", today))
            .where("created_at", "<", nextDay)
            .where("is_deleted", "=", 0);

        return fetchPolls;
    }

    async storeResponse(user_id, campaign_id, poll_id, option_id) {
        const newResponse = await UserPolls.query().insert({
            id: uuidv4(),
            user_id: user_id,
            campaign_id: campaign_id,
            poll_id: poll_id,
            option_id: option_id
        });

        return newResponse;
    }

    async pollResponses(poll_id) {
        const responses = await UserPolls.query()
            .where("poll_id", "=", poll_id)
            .where("is_deleted", "=", 0);

        return responses;
    }

    async result(data) {
        // Check if poll exists or not:
        const fetchPoll = await PollService.getOne(data.poll_id);
        if (!fetchPoll)
            throw ApiError.notFound("Incorrect poll id");

        // Check if option id is correct:
        const fetchOption = await PollOptionsServices.getOptionDetails(data.option_id, data.poll_id);
        if (!fetchOption)
            throw ApiError.notFound("Incorrect option id");


        // Check if already played this poll:
        const fetchUserPreviousResponse = await this.getUserOnePoll(data.user_id, data.poll_id);
        if (fetchUserPreviousResponse) {
            const pollResult = await this.getPollResults(data.poll_id);            
            return pollResult;
        }

        // Check if not exceed 2 polls limit:
        const todayPolls = await this.todayPolls(data.user_id);
        if (todayPolls.length === 2)
            throw ApiError.badRequest("User reached 2 polls per day limit");

        // Store user response:
        const storeResponse = await this.storeResponse(data.user_id, data.campaign_id, data.poll_id, data.option_id);
        // console.log("stored", storeResponse);

        // Fetch poll result:
        let pollResult = await this.getPollResults(data.poll_id);

        return pollResult;
    }
}

module.exports = new UserPollsServices();