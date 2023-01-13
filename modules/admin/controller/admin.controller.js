const ApiError = require("../../../utils/apiError");
const JwtUtils = require("../../../utils/jwtUtils");
const Response = require("../../../utils/response");
const AdminService = require("../services/admin.service");

const getAdmins = async (req, res) => {
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
    console.log("user", req.user);
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Id is required!");
    if (id !== req.user.id)
        return Response.error(res, ApiError.notAuthorized("Unauthorized user!"));
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
    const data = req.body;
    if (!data) return Response.error(res, ApiError.badRequest("Enter inputs!"));
    try {
        const admin = await AdminService.newAdmin(data);

        const result = {
            admin: admin
        }
        return Response.success(res, "New admin created successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const updateAdmin = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    if (!data) throw ApiError.badRequest("Enter inputs!");
    try {
        const result = await AdminService.updateAdmin(id, data);

        return Response.success(res, "Admin updated successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const deleteAdmin = async (req, res) => {
    const id = req.params.id;
    try {
        const deleteAdmin = await AdminService.deleteAdmin(id);

        return Response.success(res, "Admin deleted successfully!", null);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const adminLogin = async (req, res) => {
    const data = req.body;
    if (!data) throw ApiError.badRequest("Enter email & password!");
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

module.exports = {
    getAdmins,
    getAdminById,
    createAdmin,
    adminLogin,
    updateAdmin,
    deleteAdmin
}