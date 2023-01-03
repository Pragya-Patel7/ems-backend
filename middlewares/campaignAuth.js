const CampaignService = require("../modules/campaign/services/campaign.service");
const ApiError = require("../utils/apiError");
const Response = require("../utils/response");
const JwtUtils = require("../utils/jwtUtils");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || token == "")
        return Response.error(res, ApiError.badRequest("Token is required!"));
    try {
        const verifiedCampaign = await JwtUtils.verifyToken(token);
        if (!verifiedCampaign)
            return Response.error(res, ApiError.notAuthorized("Campaign not authorized"));

        const authorizedCampaign = await CampaignService.getById(verifiedCampaign.data.id);
        if (!authorizedCampaign)
            return Response.error(res, ApiError.notAuthorized("Campaign not authorized"));

        if (authorizedCampaign.is_deleted)
            return Response.error(res, ApiError.notActive("Campaign is not active!"));

        req.user = authorizedCampaign;
        return next();
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, ApiError.notAuthorized());

        return Response.error(res, ApiError.internal(err));
    }
}