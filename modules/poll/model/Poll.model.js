const { Model } = require("objection");
const TimeUtils = require("../../../utils/timeUtils");

class Poll extends Model {
    static get tableName() {
        return "activity_poll";
    }

    $beforeInsert() {
        this.created_at = TimeUtils.date();
        this.modified_at = TimeUtils.date();
    }

    $beforeUpdate() {
        this.modified_at = TimeUtils.date();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["question", "poll_name", "start_date"],
            properties: {
                activity_id: { type: "string" },
                poll_name: { type: "string" },
                category_id: { type: "string" },
                campaign_id: { type: "string" },
                campaign_name: { type: "string" },
                question: { type: "string" },
                duration_id: { type: "string" },
                image: { type: ["string", "null"] },
                start_date: { type: "string" },
                end_date: { type: "string" },
                created_by: { type: "string" },
                modified_by: { type: "string" },
                status: { type: "boolean", default: true },
                is_deleted: { type: "boolean", default: false }
            }
        }
    }

    static get relationMappings() {
        const Category = require("../../categories/model/Category.model");
        const PollOptions = require("../../poll_options/model/Poll_Option.model");
        const Activity = require("../../activity/model/Activity.model");

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
            },

            activity: {
                relation: Model.BelongsToOneRelation,
                modelClass: Activity,
                join: {
                    from: "activity_poll.activity_id",
                    to: "activity.id"
                }
            }
        }
    }
}


module.exports = Poll;