const ApiError = require("../../../utils/apiError");
const Response = require("../../../utils/response");
const PollService = require("../services/poll.service");
const PollOptionsService = require("../../poll_options/services/poll_options.services");
const CategoriesService = require("../../categories/services/categories.service");

const getPolls = async (req, res) => {
    // console.log("USer", req.user);
    // const { campaign_id } = req.user;
    const campaign_id = req.params.campaign_id;
    try {
        const result = await PollService.getByCampaignId(campaign_id);

        return Response.success(res, "Poll found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getPollById = async (req, res) => {
    const id = req.params.id;
    if (!id) return ApiError.badRequest("Id is required");
    try {
        const poll = await PollService.getOne(id);

        if (!poll)
            throw ApiError.notFound("Poll not found");

        return Response.success(res, "Poll found successfully!", poll)
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const createPoll = async (req, res) => {
    const loggedUser = req.user;
    console.log(">>>", loggedUser);
    const data = req.body;
    const dataLength = Object.keys(data).length
    if (!dataLength) return Response.error(res, ApiError.badRequest("Details are required to create a new poll"));

    if (!data.option_name || !data.option_name.length)
        return Response.error(res, ApiError.badRequest("Poll options are required"));

    if (req.files.question)
        data.image = req.files.question[0].path;

    try {
        let options = [];
        const files = req.files;
        for (const key in files) {
            if (key !== "question")
                options.push(files[key][0].path)
        }

        const pollOptions = {
            optionName: data.option_name,
            optionImage: options
        }

        delete data.option_name;
        data.campaign_id = loggedUser.campaign_id;
        data.created_by = loggedUser.id;
        data.modified_by = loggedUser.id;

        const result = await PollService.newPoll(data, pollOptions);

        return Response.success(res, "New poll created successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const updatePoll = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const dataLength = Object.keys(data).length
    if (!dataLength) return Response.error(res, ApiError.badRequest("Update data is required"));

    data.id = id;
    if ("coin" in data)
        data.coin = parseInt(data.coin);

    if ("question" in req.files)
        data.image = req.files.question[0].path;
    try {
        let options = [];
        const files = req.files;
        for (const key in files) {
            if (key !== "question")
                options.push(files[key][0].path)
        }

        const pollOptions = {};
        if (options.length)
            pollOptions.optoinImage = options;

        if (data.option_name)
            pollOptions.optionName = data.option_name;

        const updatedPoll = await PollService.updatePoll(data, pollOptions);

        return Response.success(res, "Poll updated successfully", updatedPoll);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const deletePoll = async (req, res) => {
    const id = req.params.id;
    if (!id) return Response.error(res, ApiError.badRequest("Id is required to delete poll"));
    try {
        const deletePoll = await PollService.deletePoll(id);

        return Response.success(res, "Poll deleted successfully!", null);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getYearlyPoll = async (req, res) => {
    let category_id = req.query.category;

    if (!category_id)
        return Response.error(res, ApiError.badRequest("Category id is required"));

    category_id = category_id.replace(/['"]+/g, '');
    try {
        const getYearlyPoll = await PollService.getYearlyPoll(category_id);

        return Response.success(res, "Yearly poll found successfully!", getYearlyPoll);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getPollOfTheDay = async (req, res) => {
    let category_id = req.query.category;

    if (category_id)
        category_id = category_id.replace(/['"]+/g, '');

    let campaign_id = req.query.campaign;
    if (!campaign_id)
        return Response.error(res, ApiError.badRequest("Campaign id is required"));

    campaign_id = campaign_id.replace(/['"]+/g, '');
    try {
        const pollOfTheDay = await PollService.getPollOfTheDay(category_id, campaign_id);

        return Response.success(res, "Poll of the Day found successfully!", pollOfTheDay);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getPollByDuration = async (req, res) => {
	// console.log("Srsly!")
    const campaign_id = req.query.campaign_id?.replace(/['"]+/g, '');;
    const duration = req.query.duration?.toLowerCase()?.replace(/['"]+/g, '');;
    if (!campaign_id || !duration)
        throw ApiError.badRequest("Missing campaign id or duration");
    try {
        const poll = await PollService.pollByDuration(campaign_id, duration);
        return Response.success(res, `${duration} poll found successfully!`, poll);
    } catch (err) {
        console.log(err);
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));        
    }
}

const getPreviousPolls = async (req, res) => {
    const category_id = req.params.category_id;
    try {
        const result = await PollService.previousPolls(category_id);

        return Response.success(res, "Previous polls found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

module.exports = {
    getPolls,
    createPoll,
    getPollById,
    updatePoll,
    deletePoll,
    getYearlyPoll,
    getPollOfTheDay,
    getPreviousPolls,
    getPollByDuration,
}