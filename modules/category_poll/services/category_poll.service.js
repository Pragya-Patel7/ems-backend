const CategoryPoll = require("../model/Category_poll.model");

class CategoryPollServices{
    async getAll() {
        const categoryPolls = await CategoryPoll.query().where("is_deleted", "=", 0);

        return categoryPolls;
    }

    async getOne(category_id) {
        const categoryPolls = await CategoryPoll.query().findOne({ category_id: category_id }).where("is_deleted", "=", 0).withGraphFetched({ category: true, poll_duration: true, poll: true });

        return categoryPolls;
    }

    async update(category_id, data) {
        const category = await this.getOne(category_id);
        const categoryPolls = await category.$query().patchAndFetch({ data });

        return categoryPolls;
    }

    async delete(category_id) {
        const data = { is_deleted: true };
        const deleteCategoryPoll = await this.update(category_id, data);

        return deleteCategoryPoll;
    }
}

module.exports = new CategoryPollServices();