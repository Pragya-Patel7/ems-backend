const { Model } = require("objection");

class UserPolls extends Model {
    static tableName() {
        return "user_polls";
    }

    $beforeInsert() {
        this.created_at = new Date();
        this.modified_at = new Date();
    }

    $beforeUpdate() {
        this.modified_at = new Date();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["user_id", "poll_id", "option_id"],
            properties: {
                user_id: { type: "string" },
                campaign_id: { type: "string" },
                poll_id: { type: "string" },
                option_id: { type: "string" },
                is_deleted: { type: "boolean", default: false }
            }
        }
    }
}

module.exports = UserPolls;