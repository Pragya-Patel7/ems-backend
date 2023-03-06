const ApiError = require("../../../utils/apiError");
const Response = require("../../../utils/response");
const ActivityService = require("../services/activity.service");

const getAllActivity = async (req, res) => {
    try {
        const activities = await ActivityService.getAll();

        const result = {
            activities: activities
        }

        return Response.success(res, "Activities found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getActivityById = async (req, res) => {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Activity id is required!");
    try {
        const activity = await ActivityService.getById(id);

        const result = {
            activity: activity
        }

        return Response.success(res, "Activity found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const updateActivity = async (req, res) => {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Activity id is required!");
    
    const data = req.body;
    if (!data) throw ApiError.badRequest("Enter update inputs");
    try {
        const updatedActivity = await ActivityService.updateById(id, data);

        const result = {
            activity: updatedActivity
        }

        return Response.success(res, "Activity updated successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const deleteActivity = async (req, res) => {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Activity id is required!");
    
    try {
        const deleteActivity = await ActivityService.delete(id);

        return Response.success(res, "Activity deleted successfully!", deleteActivity);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const createActivity = async (req, res) => {
    const data = req.body;
    try {
        const newActivity = await ActivityService.create(data);

        return Response.success(res, "Activity create successfully!", newActivity);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

module.exports = {
    getAllActivity,
    getActivityById,
    updateActivity,
    deleteActivity,
    createActivity
}