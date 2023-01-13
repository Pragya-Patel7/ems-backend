const { Model } = require("objection");

class PollOptions extends Model {
    static get tableName() {
        return "poll_option";
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
            required: ["option"],
            properties: {
                option: { type: ["string", "null"], minLength: 1, maxLength: 255 },
                option_image: { type: ["string", "null"] },
                poll_id: { type: "string" },
                is_deleted:{type: "boolean", default: false},
            }
        }
    }
}

module.exports = PollOptions;