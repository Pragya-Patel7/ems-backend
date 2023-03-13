const ApiError = require("../../../utils/apiError");
const Response = require("../../../utils/response");
const PollService = require("../../poll/services/poll.service");
const UserPollsService = require("../services/user_polls.service");

const getUserPolls = async (req, res) => {
    try {
        const userPolls = await UserPollsService.getAll();
        return Response.success(res, "User Polls found successfully!", userPolls);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const addNewUserPoll = async (req, res) => {
    const data = req.body;
    if (!data.user_id || !data.poll_id || !data.option_id)
        return Response.error(res, ApiError.badRequest("Enter credentials"));

    const fetchPoll = await PollService.getOne(data.poll_id);
    if (!fetchPoll)
        throw ApiError.notFound("Poll not found");
    try {
        const newUserPoll = await UserPollsService.create(data);

        return Response.success(res, "New user_poll created successfully!", newUserPoll);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getUserPollResult = async (req, res) => {
    const pollId = req.params.pollId;
    try {
        const poll = await PollService.getOne(pollId);
        if (!poll) return Response.error(res, ApiError.notFound("Poll not found"));
        const result = await UserPollsService.getPollResults(pollId);

        return Response.success(res, "Poll results found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const rollbackUserPoll = async (req, res) => {
    const { user_id, poll_id, option_id } = req.body;
    if (!user_id || !poll_id || !option_id)
        return Response.error(res, ApiError.badRequest("Insufficient details!"));
    try {
        const deleteUserPoll = await UserPollsService.deleteUserPoll(user_id, poll_id, option_id);

        return Response.success(res, "User response rollback successfully!", true);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const userTodaysPolls = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const polls = await UserPollsService.todayPolls(user_id);
        return Response.success(res, `This user played ${polls.length} poll today`, polls);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err))
    }
}

const userResponse = async (req, res) => {
    const data = req.body;
    const fetchPoll = await PollService.getOne(data.poll_id);
    if (!fetchPoll)
        throw ApiError.notFound("Incorrect poll id");
    try {
        let response = await UserPollsService.result(data);
        response.result.question = fetchPoll.question;
        response.result.coin_value = fetchPoll.activity?.coin_value;

        let msg = "User responed and found poll results successfully!";
        if (response.alreadyPlayed)
            msg = "User already this poll and result of poll found successfully!";

        return Response.success(res, msg, response.result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err))
    }
}

module.exports = {
    getUserPolls,
    addNewUserPoll,
    getUserPollResult,
    rollbackUserPoll,
    userTodaysPolls,
    userResponse
}