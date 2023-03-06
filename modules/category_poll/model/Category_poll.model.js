const { Model } = require("objection");

class CategoryPoll extends Model{
    static tableName() {
        return "category_poll";
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
            properties: {
                category_id: { type: "string" },
                poll_duration_id: { type: "string" },
                poll_id: { type: "string" },
                is_deleted: {type: "boolean", default: false},
            }
        }
    }

    static get relationMappings() {
        const Category = require("../../categories/model/Category.model");
        const pollDuration = require("../../poll_duration/model/Poll_duration.model");
        const poll = require("../../poll/model/Poll.model");

        return {
            category: {
                relation: Model.HasManyRelation,
                modelClass: Category,
                join: {
                    from: "category_poll.category_id",
                    to: "categories.id"
                }
            },
            poll_duration: {
                relation: Model.HasManyRelation,
                modelClass: pollDuration,
                join: {
                    from: "category_poll.poll_duration_id",
                    to: "poll_duration.id"
                }
            },
            poll: {
                relation: Model.HasManyRelation,
                modelClass: poll,
                join: {
                    from: "category_poll.poll_id",
                    to: "activity_poll.id"
                }
            }
        }
    }
}

module.exports = CategoryPoll;