require("dotenv").config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

// Update with your config settings.
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: DB_HOST,
      user: DB_USER, // replace with your mysql username
      password: DB_PASSWORD, // replace with your mysql password
      database: DB_DATABASE,
      typeCast: function castField(field, useDefaultTypeCasting) {
        if ((field.type === "BIT") && (field.length === 1)) {
          let bytes = field.buffer();
          return (bytes[0] === 1);
        }
        return (useDefaultTypeCasting());
      }
    },
    migrations: {
      directory: 'db/migrations'
    },
    seeds: {
      directory: "db/seeds"
    },
    debug: true
  },
};