const ApiError = require("../../../utils/apiError");
const JwtUtils = require("../../../utils/jwtUtils");
const Response = require("../../../utils/response");
const AdminService = require("../services/admin.service");

const getAdmins = async (req, res) => {
    if (req.user.role_id === 3) return Response.error(res, ApiError.notAuthorized());
    try {
        const result = await AdminService.getAll();

        return Response.success(res, "Admins found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getAdminById = async (req, res) => {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Id is required!");

    if (req.user.role_id != 1) {
        if (id !== req.user.id)
            return Response.error(res, ApiError.notAuthorized("Unauthorized user!"));
    }
    try {
        const result = await AdminService.getById(id);

        return Response.success(res, "Admin found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const createAdmin = async (req, res) => {
    const loggedUser = req.user;
    if (loggedUser.role_id != 1)
        return Response.error(res, ApiError.notAuthorized("Only super admin can create new admin"));

    const data = req.body;
    const dataLength = Object.keys(data).length;
    if (!dataLength) return Response.error(res, ApiError.badRequest("Details are required to create admin"));

    data.created_by = loggedUser.id;
    data.modified_by = loggedUser.id;
    try {
        const admin = await AdminService.newAdmin(data);

        return Response.success(res, "New admin created successfully!", admin);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const updateAdmin = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const dataLength = Object.keys(data).length;
    if (!dataLength) throw ApiError.badRequest("Details are required");

    data.modified_by = req.user.id;
    try {
        const result = await AdminService.updateAdmin(id, data);

        return Response.success(res, "Admin updated successfully!", result);
    } catch (err) {
        console.log(err);
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const deleteAdmin = async (req, res) => {
    const id = req.params.id;
    try {
        const deleteAdmin = await AdminService.deleteAdmin(id);

        return Response.success(res, "Admin deleted successfully!", deleteAdmin);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const adminLogin = async (req, res) => {
    const data = req.body;
    const dataLength = Object.keys(data).length;
    if (!dataLength) throw ApiError.badRequest("Enter credentials");
    try {
        const admin = await AdminService.adminLogin(data);
        const token = await JwtUtils.generateToken(admin);

        const result = {
            token: token,
            admin: admin
        }

        return Response.success(res, "Admin logged in successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const authAdmin = async (req, res) => {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token || token == "")
        return Response.error(res, ApiError.badRequest("Token is required!"));
    try {
        const verifiedAdmin = await JwtUtils.verifyToken(token);
        if (!verifiedAdmin)
            return Response.error(res, ApiError.notAuthorized("Admin not authorized"));

        const admin = await AdminService.getById(verifiedAdmin.data.id);
        if (!admin)
            return Response.error(res, ApiError.notAuthorized("Admin not authorized"));

        console.log("Auth", admin);
        return Response.success(res, "Admin found and is verified", admin);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, ApiError.notAuthorized());

        return Response.error(res, ApiError.internal(err));
    }
}
const getRoles = async (req, res) => {
    try {
        const roles = await AdminService.roles();
        return Response.success(res, "Roles found successfully!", roles);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, ApiError.notAuthorized());

        return Response.error(res, ApiError.internal(err));
    }
}

module.exports = {
    getAdmins,
    getAdminById,
    createAdmin,
    adminLogin,
    updateAdmin,
    deleteAdmin,
    authAdmin,
    getRoles
}