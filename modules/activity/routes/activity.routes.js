const { getAllActivity, getActivityById, updateActivity, deleteActivity, createActivity } = require("../controller/activity.controller");

const router = require("express").Router();

router.get("/", getAllActivity)
    .get("/:id", getActivityById)
    .patch("/:id", updateActivity)
    .delete("/:id", deleteActivity)
    .post("/", createActivity);

module.exports = router;