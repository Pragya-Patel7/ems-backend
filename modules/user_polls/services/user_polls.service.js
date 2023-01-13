const UserPolls = require("../model/User_polls.model");
const ApiError = require("../../../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const PollOptionsServices = require("../../poll_options/services/poll_options.services");
// const PollService = require("../../poll/services/poll.service");
const PollService = require("../../poll/services/poll.service");

class UserPollsServices {
    async getAll() {
        const userPolls = await UserPolls.query().where("is_deleted", "=", 0);
        return userPolls;
    }

    async getUserAllPolls(user_id) {
        const userPoll = await UserPolls.query()
            .where("user_id", "=", user_id)

        return userPoll;
    }

    async getUserOnePoll(user_id, poll_id) {
        const userPoll = await UserPolls.query().findOne({ user_id: user_id, poll_id: poll_id });

        return userPoll;
    }

    async getUserPollById(id) {
        const userPoll = await UserPolls.query().findById(id);

        return userPoll;
    }

    async getUserPollOption(poll_id, option_id) {
        const users = await (await UserPolls.query()).find({ poll_id: poll_id, option_id: option_id });

        return users;
    }

    async update(id, data) {
        const fetchPoll = await this.getOne(id);
        if (!fetchPoll)
            throw ApiError.notFound("This user poll not found");

        const updatePoll = await fetchPoll.$query().patchAndFetch(data);

        return updatePoll;
    }

    async delete(id) {
        const data = { is_deleted: 0 };
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
        const poll = await PollService.getOne(poll_id);
        if (!poll)
            throw ApiError.notFound("Poll not found");
        
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
                total_users: users.length
            }
            arr.push(obj);
        }

        const result = {
            poll_id: poll_id,
            question: poll.question,
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
}

module.exports = new UserPollsServices();