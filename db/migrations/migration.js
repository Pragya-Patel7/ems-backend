exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("admins")
        .dropTableIfExists("campaign_login")
        .dropTableIfExists("user_polls")
        .dropTableIfExists("activity")
        .dropTableIfExists("activity_poll")
        .dropTableIfExists("poll_option")
        .dropTableIfExists("categories")
};

exports.up = async function (knex) {
    await knex.schema.createTable("admins", (table) => {
        table.uuid("id").primary();
        table.string("name");
        table.string("email");
        table.string("mobile");
        table.string("password");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("modified_at").defaultTo(knex.fn.now());
        table.boolean("is_deleted");
    })

    await knex.schema.createTable("campaign_login", (table) => {
        table.uuid("id").primary();
        table.string("name");
        table.string("email");
        table.string("password");
        table.boolean("status");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("modified_at").defaultTo(knex.fn.now());
        table.boolean("is_deleted");
    })

    await knex.schema.createTable("user_polls", (table) => {
        table.uuid("id").primary();
        table.uuid("user_id");
        table.uuid("option_id");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("modified_at").defaultTo(knex.fn.now());
        table.boolean("is_deleted");
    })

    await knex.schema.createTable("activity", (table) => {
        table.uuid("id").primary();
        table.string("name");
        table.boolean("status");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("modified_at").defaultTo(knex.fn.now());
        table.boolean("is_deleted");
    })

    await knex.schema.createTable("activity_poll", (table) => {
        table.uuid("id").primary();
        table.uuid("activity_id");
        table.string("question");
        table.integer("coin");
        table.timestamp("start_date").defaultTo(knex.fn.now());
        table.boolean("status");
        table.uuid("category_id");
        table.uuid("campaign_id");
        table.string("poll_name");
        table.string("image");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("modified_at").defaultTo(knex.fn.now());
        table.boolean("is_deleted");
    })

    await knex.schema.createTable("poll_option", (table) => {
        table.uuid("id").primary();
        table.uuid("poll_id");
        table.string("option");
        table.string("option_image");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("modified_at").defaultTo(knex.fn.now());
        table.boolean("is_deleted");
    })

    await knex.schema.createTable("categories", (table) => {
        table.uuid("id").primary();
        table.string("name");
        table.uuid("poll_id");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("modified_at").defaultTo(knex.fn.now());
        table.boolean("is_deleted");
    })
    return true;
};