const { Model } = require("objection");

class Poll extends Model {
    static get tableName() {
        return "activity_poll";
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
            required: ["question", "poll_name", "start_date"],
            properties: {
                activity_id: { type: "string" },
                question: { type: "string" },
                coin: { type: "number" },
                poll_name: { type: "string" },
                image: { type: ["string", "null"] },
                start_date: { type: "string" },
                duration: {type: "string"},
                category_id: { type: "string" },
                campaign_id: { type: "string" },
                status: { type: "boolean", default: true },
                is_deleted: { type: "boolean", default: false }
            }
        }
    }

    static get relationMappings() {
        const Category = require("../../categories/model/Category.model");
        const PollOptions = require("../../poll_options/model/Poll_Option.model");

        return {
            category: {
                relation: Model.HasManyRelation,
                modelClass: Category,
                join: {
                    from: "activity_poll.category_id",
                    to: "categories.id"
                }
            },

            poll_option: {
                relation: Model.HasManyRelation,
                modelClass: PollOptions,
                join: {
                    from: "activity_poll.id",
                    to: "poll_option.poll_id"
                }
            }
        }
    }
}


module.exports = Poll;