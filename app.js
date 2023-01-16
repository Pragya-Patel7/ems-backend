const express = require('express');
const morgan = require('morgan');
const corsOptions = require('./config/cors');
const app = express();

const VERSION = "v1";
const ENDPOINT = "api";

// importing all modules routes:
const adminRouter = require("./modules/admin/routes/admin.routes");
const activityRouter = require("./modules/activity/routes/activity.routes");
const categoryRouter = require("./modules/categories/routes/categories.routes");
const pollsRouter = require("./modules/poll/routes/poll.routes");
const userPollRouter = require("./modules/user_polls/routes/user_polls.routes");

function router(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(`/${ENDPOINT}/${VERSION}/admins`, adminRouter);
    app.use(`/${ENDPOINT}/${VERSION}/activity`, activityRouter);
    app.use(`/${ENDPOINT}/${VERSION}/categories`, categoryRouter);
    
    app.use(`/${ENDPOINT}/${VERSION}/polls`, pollsRouter);
    app.use(`/${ENDPOINT}/${VERSION}/user_polls`, userPollRouter);
}

// Initializing routes:
router(app);

// middlewares:
app.use(corsOptions);
app.use(morgan(":method :status :url"))

module.exports = app;