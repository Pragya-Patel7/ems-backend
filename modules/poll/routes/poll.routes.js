const upload = require("../../../middlewares/multer");
const { createPoll, getPolls, getPollById, deletePoll, updatePoll, getYearlyPoll } = require("../controller/poll.controller");

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

router.get("/", getPolls);
router.post("/", upload.fields(multipleImages), createPoll);

router.get("/yearly", getYearlyPoll);
router.get("/:id", getPollById);
router.patch("/:id", upload.fields(multipleImages), updatePoll);
router.delete("/:id", deletePoll);


module.exports = router;