const auth = require("../../../middlewares/campaignAuth");
const { getCampaigns, getCampaignById, createCampaign, campaignLogin, updateCampaign, deleteCampaign } = require("../controller/campaign.controller");

let router = require("express").Router();

router.get("/", getCampaigns);
router.get("/:id", auth, getCampaignById);
router.post("/", createCampaign);
router.patch("/:id", auth, updateCampaign);
router.delete("/:id", auth, deleteCampaign);
router.post("/login", campaignLogin);

module.exports = router;