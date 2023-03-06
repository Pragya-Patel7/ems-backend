const { Model } = require("objection");

class Category extends Model {
    static get tableName() {
        return "categories";
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
            required: ["name"],
            properties: {
                name: { type: "string", minLength: 1, maxLength: 255 },
                status: { type: "boolean", default: true },
                is_deleted: { type: "boolean", default: false }
            }
        }
    }
}

module.exports = Category;