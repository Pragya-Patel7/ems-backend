const cors = require('cors');

const corsOptions = cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "authorization", "Authorization"],
});

module.exports = corsOptions;