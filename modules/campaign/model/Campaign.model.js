const { Model } = require("objection");

class Campaign extends Model {
    static get tableName() {
        return "campaign_Login";
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
            required: ["name", "email", "password"],
            properties: {
                name: { type: "string", minLength: 1, maxLength: 255 },
                email: { type: "string" },
                password: { type: "string" },
                status: { type: "boolean" },
                is_deleted: { type: "boolean" },
            }
        }
    }
}

module.exports = Campaign;