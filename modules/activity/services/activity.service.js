const ApiError = require("../../../utils/apiError");
const Activity = require("../model/Activity.model");
const { v4: uuidv4 } = require("uuid");

class ActivityService {
    async getAll() {
        const activities = await Activity.query()
            .where("is_deleted", "=", 0);

        return activities;
    }

    async getById(id) {
        const activity = await Activity.query()
            .findById(id)
            .where("is_deleted", "=", 0);

        if (!activity)
            throw ApiError.notFound("Activity not found!");

        return activity;
    }

    async updateById(id, data) {
        if ("is_deleted" in data)
            throw ApiError.badRequest("is_deleted action is not allowed!");
        
        const activity = await Activity.query()
            .findById(id)
            .where("is_deleted", "=", 0);

        if (!activity)
            throw ApiError.notFound("Activity not found!");

        const updatedActivity = await Activity.query().patchAndFetchById(id, data);

        return updatedActivity;
    }

    async delete(id) {
        const activity = await Activity.query()
            .findById(id)
            .where("is_deleted", "=", 0);

        if (!activity)
            throw ApiError.notFound("Activity not found!");

        await Activity.query().patchAndFetchById(id, {is_deleted: true});

        return true;
    }

    async create(data) {
        data.id = uuidv4();
        const newActivity = await Activity.query().insert(data);

        return newActivity;
    }
}

module.exports = new ActivityService();