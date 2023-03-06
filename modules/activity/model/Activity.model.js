const { Model } = require("objection");

class Activity extends Model {
    static get tableName() {
        return "activity";
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
            required: ["name", "coin_value", "status"],
            properties: {
                name: { type: "string", minLength: 1, maxLength: 255 },
                coin_value: { type: "integer" },
                status: { type: "boolean", default: true },
                is_deleted: { type: "boolean", default: false }
            }
        }
    }
}

module.exports = Activity;