const express = require('express');
const morgan = require('morgan');
// const corsOptions = require('./config/cors');
const cors = require("cors");
const app = express();

const whitelist = ['http://localhost:3000', 'http://127.0.0.1:5500'];

// ✅ Enable pre-flight requests
app.options('*', cors());

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

// console.log("Options>>>", corsOptions);
app.use(cors(corsOptions));

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
    
    app.use(`/${ENDPOINT}/${VERSION}/polls/user`, userPollRouter);
    app.use(`/${ENDPOINT}/${VERSION}/polls`, pollsRouter);
}

// Initializing routes:
router(app);

// middlewares:
// app.use(corsOptions);
app.use(morgan(":method :status :url"))

module.exports = app;