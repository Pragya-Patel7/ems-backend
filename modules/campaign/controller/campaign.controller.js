const ApiError = require("../../../utils/apiError");
const JwtUtils = require("../../../utils/jwtUtils");
const Response = require("../../../utils/response");
const CampaignService = require("../services/campaign.service");

const getCampaigns = async (req, res) => {
    try {
        const result = await CampaignService.getAll();

        return Response.success(res, "Campaigns found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getCampaignById = async (req, res) => {
    console.log("Auth:", req.user);
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Id is required!");
    try {
        const result = await CampaignService.getById(id);

        return Response.success(res, "Campaign found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const createCampaign = async (req, res) => {
    const data = req.body;
    if (!data) return Response.error(res, ApiError.badRequest("Enter inputs!"));
    try {
        const campaign = await CampaignService.newCampaign(data);
        const token = await JwtUtils.generateToken(campaign);

        const result = {
            token: token,
            campaign: campaign
        }
        return Response.success(res, "New campaign created successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const updateCampaign = async (req, res) => {
    console.log(req.user);
    const id = req.params.id;
    const data = req.body;
    if (!data) throw ApiError.badRequest("Enter inputs!");
    try {
        const result = await CampaignService.updateCampaign(id, data);

        return Response.success(res, "Campaign updated successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const deleteCampaign = async (req, res) => {
    const id = req.params.id;
    try {
        const deleteCampaign = await CampaignService.deleteCampaign(id);

        return Response.success(res, "Campaign deleted successfully!", deleteCampaign);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const campaignLogin = async (req, res) => {
    const data = req.body;
    if (!data) throw ApiError.badRequest("Enter email & password!");
    try {
        const campaign = await CampaignService.campaignLogin(data);
        const token = await JwtUtils.generateToken(campaign);

        const result = {
            token: token,
            campaign: campaign
        }

        return Response.success(res, "Campaign logged in successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

module.exports = {
    getCampaigns,
    getCampaignById,
    createCampaign,
    campaignLogin,
    updateCampaign,
    deleteCampaign
}