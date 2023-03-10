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
            required: ["name", "email", "role_id"],
            properties: {
                name: { type: "string", minLength: 1, maxLength: 255 },
                email: { type: "string" },
                password: { type: "string" },
                campaign_id: { type: "string" },
                campaign_name: { type: "string" },
                client_id: { type: "string", default: 3 },
                client_name: { type: "string" },
                role_id: { type: "integer" },
                status: { type: "boolean", default: true },
                is_deleted: { type: "boolean", default: false },
            }
        }
    }
}

module.exports = Admin;