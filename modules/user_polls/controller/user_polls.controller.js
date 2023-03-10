const ApiError = require("../../../utils/apiError");
const Response = require("../../../utils/response");
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

        return Response.success(res, "User Poll rollback successfully!", null);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);
        
        return Response.error(res, ApiError.internal(err));
    }
}

module.exports = {
    getUserPolls,
    addNewUserPoll,
    getUserPollResult,
    rollbackUserPoll,
}