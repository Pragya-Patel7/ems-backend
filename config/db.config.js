const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } = process.env;

module.exports = {
    development: {
        client: "mysql2",
        connection: {
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_DATABASE
        },
        debug: true,
    }
}