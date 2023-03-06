const { getUserPolls, addNewUserPoll, getUserPollResult, rollbackUserPoll, userTodaysPolls, userResponse } = require("../controller/user_polls.controller");
const auth = require("../../../middlewares/auth");

let router = require("express").Router();

router.get("/result/:pollId", getUserPollResult);
router.patch("/rollback", rollbackUserPoll);
router.post("/response", userResponse);
router.get("/today/:user_id", userTodaysPolls);
router.get("/", getUserPolls);
router.post("/", addNewUserPoll);

module.exports = router;