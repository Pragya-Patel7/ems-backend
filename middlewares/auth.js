const AdminService = require("../modules/admin/services/admin.service");
const ApiError = require("../utils/apiError");
const Response = require("../utils/response");
const JwtUtils = require("../utils/jwtUtils");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || token == "")
        return Response.error(res, ApiError.badRequest("Token is required!"));
    try {
        const verifiedAdmin = await JwtUtils.verifyToken(token);
        if (!verifiedAdmin)
            return Response.error(res, ApiError.notAuthorized("Admin not authorized"));
        
        const authorizedAdmin = await AdminService.getById(verifiedAdmin.data.id);
        if (!authorizedAdmin)
            return Response.error(res, ApiError.notAuthorized("Admin not authorized"));
        
        if (authorizedAdmin.is_deleted)
            return Response.error(res, ApiError.notActive("Admin is not active!"));
        
        req.user = authorizedAdmin;
        return next();
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, ApiError.notAuthorized());

        return Response.error(res, ApiError.internal(err));
    }
}