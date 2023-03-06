const PollOptions = require("../model/Poll_Option.model");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../../../utils/apiError");

class PollOptionsService {
    async newOptions(pollId, options) {
        await this.deleteOptions(pollId);
        const { optionName, optionImage } = options;

        async function insertOption() {
            let arr = [];
            let length;
            if (optionName)
                length = optionName.length
            else
                length = optionImage.length;

            for (let i = 0; i < length; i++){
                let pollOption = await PollOptions.query().insert({
                    id: uuidv4(),
                    option: optionName ? String(optionName[i]) : null,
                    option_image: optionImage ? optionImage[i] : null,
                    poll_id: pollId
                });
                arr.push(pollOption);
            }
            return arr;
        }

        const resp = await insertOption();
        return resp;
    }

    async getOptions(poll_id) {
        const options = await PollOptions.query()
            .select("*")
            .where("poll_id", "=", poll_id)
            .where("is_deleted", "=", 0);

        return options;
    }

    async getOptionDetails(option_id, pollId) {
        const fetchOption = await PollOptions.query()
            .findOne({id: option_id, poll_id: pollId})
            .where("is_deleted", "=", 0);

        return fetchOption;
    }

    async updateOptions(poll_id, options) {
        await this.deleteOptions(poll_id);

        const newOptions = await this.newOptions(poll_id, options);
        return newOptions;
    }

    async deleteOptions(poll_id) {
        await PollOptions.query()
            .delete()
            .where("poll_id", "=", poll_id);
        
        return true;
    }
}

module.exports = new PollOptionsService();