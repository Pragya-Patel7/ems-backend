const { Model } = require("objection");

class Admin extends Model {
    static get tableName() {
        return "admins";
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
            required: ["name", "email"],
            properties: {
                name: { type: "string", minLength: 1, maxLength: 255 },
                email: { type: "string" },
                password: { type: "string" },
                status: { type: "boolean" },
                campaign_id: { type: "string" },
                is_deleted: { type: "boolean" },
            }
        }
    }
}

module.exports = Admin;