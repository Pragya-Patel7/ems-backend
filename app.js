const express = require('express');
const morgan = require('morgan');
const corsOptions = require('./cors');
const app = express();

const VERSION = "v1";
const ENDPOINT = "api";

// importing all modules routes:
const adminRouter = require("./modules/admin/routes/admin.routes");
const activityRouter = require("./modules/activity/routes/activity.routes");
const categoryRouter = require("./modules/categories/routes/categories.routes");

function router(app) {
    app.use(express.json());
    
    app.use(`/${ENDPOINT}/${VERSION}/admins`, adminRouter);
    app.use(`/${ENDPOINT}/${VERSION}/activity`, activityRouter);
    app.use(`/${ENDPOINT}/${VERSION}/categories`, categoryRouter);
}

// Initializing routes:
router(app);

// middlewares:
app.use(corsOptions);
app.use(morgan(":method :status :url"))

module.exports = app;