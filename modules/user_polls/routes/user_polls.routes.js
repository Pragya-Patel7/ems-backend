const { getUserPolls, addNewUserPoll, getUserPollResult, rollbackUserPoll } = require("../controller/user_polls.controller");

let router = require("express").Router();

router.get("/", getUserPolls);
router.post("/", addNewUserPoll);
router.get("/result/:pollId", getUserPollResult);
router.patch("/rollback", rollbackUserPoll);

module.exports = router;