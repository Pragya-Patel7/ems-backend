const upload = require("../../../middlewares/multer");
const {
    createPoll,
    getPolls,
    getPollById,
    deletePoll,
    updatePoll,
    getYearlyPoll,
    getPollOfTheDay,
    getPreviousPolls,
    getPollByDuration
} = require("../controller/poll.controller");
const auth = require("../../../middlewares/auth");

let router = require("express").Router();

const multipleImages = [
    {
        name: "question",
        maxCount: 1,
    },
    {
        name: "option1",
        maxCount: 1
    },
    {
        name: "option2",
        maxCount: 1
    },
    {
        name: "option3",
        maxCount: 1
    },
    {
        name: "option4",
        maxCount: 1
    },
    {
        name: "option5",
        maxCount: 1
    },
    {
        name: "option6",
        maxCount: 1
    },
    {
        name: "option7",
        maxCount: 1
    },
    {
        name: "option8",
        maxCount: 1
    },
    {
        name: "option9",
        maxCount: 1
    },
    {
        name: "option10",
        maxCount: 1
    },
];


router.get("/yearly", auth, getYearlyPoll);
router.get("/potd", auth, getPollOfTheDay);
router.get("/duration", getPollByDuration);
router.get("/previous/:category_id", auth, getPreviousPolls);
router.get("/:id", auth, getPollById);
router.patch("/:id", auth, upload.fields(multipleImages), updatePoll);
router.delete("/:id", auth, deletePoll);
router.get("/:campaign_id", getPolls);  // Removed auth
router.post("/", auth, upload.fields(multipleImages), createPoll);

module.exports = router;