const Knex = require("knex");
const knexConfig = require("./knexfile")
const app = require("./app");
const { Model, ForeignKeyViolationError, ValidationError } = require("objection");

const PORT = process.env.PORT || 5000;

// Initializing knex:
const knex = Knex(knexConfig.development);

// Connecting DB:
const connect = () => {
    try {
        Model.knex(knex);
        console.log("DB connected");
    } catch (error) {
        throw error;
    }
}

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        connect();
        console.log(`cms server is running on port ${PORT}`);
    })
}