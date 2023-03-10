const ApiError = require("../../../utils/apiError");
const PollDuration = require("../model/Poll_duration.model");

class PollDurationServices{
    async getAll(){
        const pollDurations = await PollDuration.query().where("is_deleted", "=", 0);

        return pollDurations;
    }

    async getOne(id){
        const pollDuration = await PollDuration.query()
            .findOne({id: id})
            .where("is_deleted", "=", 0);

        return pollDuration;
    }

    async findDurationId(duration) {
        const id = await PollDuration.query().findOne({ duration: duration, is_deleted: false }).select("id", "duration");
        
        return id;
    }

    async update(id, data) {
        const fetchPollDuration = await this.getOne(id);

        if (!fetchPollDuration)
            throw ApiError.notFound("Poll duration not found");

        const updatedPollDuration = await PollDuration.query().updateAndFetchById(id, data);

        return updatedPollDuration;
    }

    async delete(id) {
        const data = { is_deleted: true };
        
        const deletePollDuration = await this.update(id, data);

        return deletePollDuration;
    }
}

module.exports = new PollDurationServices();