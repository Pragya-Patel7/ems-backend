const { Model } = require("objection");

class PollDuration extends Model {
    static tableName() {
        return "poll_duration";
    }

    $beforeInsert() {
        this.created_at = new Date();
        this.modified_at = new Date();
    }

    $beforeUpdate() {
        this.modified_at = new Date();
    }

    static jsonSchema() {
        return {
            type: "object",
            required: ["duration"],
            properties: {
                duration: { type: "string" },
                status: { type: "boolean", default: true },
                is_deleted: { type: "boolean", default: false },
            }
        }
    }
};

module.exports = PollDuration;