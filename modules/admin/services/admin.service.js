const ApiError = require("../../../utils/apiError");
const Admin = require("../model/Admin.model")
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

class AdminService {
    async getAll() {
        const admins = await Admin.query()
            .select("*")
            .where("is_deleted", "=", 0);

        if (!admins.length)
            throw ApiError.notFound("Admins does not exists!");

        let adminArr = [];
        admins.map(admin => {
            let obj = {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                campaign_id: admin.campaign_id,
                status: admin.status,
            }
            adminArr.push(obj);
        })
        return adminArr;
    }

    async getById(id) {
        const admin = await Admin.query()
            .findOne({ id: id })
            .where("is_deleted", "=", 0);

        // console.log("object", admin);
        if (!admin)
            throw ApiError.notFound("Admin does not exists!");

        const shortAdmin = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            campaign_id: admin.campaign_id,
            status: admin.status,
        }

        return shortAdmin;
    }

    async newAdmin(data) {
        const fetchWithEmail = await Admin.query()
            .select("email")
            .where("email", "=", data.email);

        if (fetchWithEmail.length)
            throw ApiError.alreadyExists("This email is already used!")

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newAdmin = await Admin.query().insert({
            id: uuidv4(),
            name: data.name,
            email: data.email,
            password: hashedPassword,
            campaign_id: data.campaign_id,
            status: data.status,
            is_deleted: false,
        });

        const admin = {
            id: newAdmin.id,
            name: newAdmin.name,
            email: newAdmin.email,
            campaign_id: newAdmin.campaign_id,
            status: newAdmin.status,
        }

        return admin;
    }

    async updateAdmin(id, data) {
        if ("is_deleted" in data)
            throw ApiError.notAuthorized("Cannot re-active the deleted account");

        const fetchAdmin = await Admin.query()
            .findOne({id: id})
            .where("is_deleted", "=", 0);

        if (!fetchAdmin)
            throw ApiError.badRequest("Admin does not exists!");

        if ("current_password" in data) {
            // Verify old password:
            const verifyPassword = await bcrypt.compare(data.current_password, fetchAdmin.password);
            if (!verifyPassword)
                throw ApiError.notAuthorized("Invalid password!");

            // Create new password:
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(data.new_password, salt);
            data.password = hashedPassword;

            // Delete current password from receiving data from body:
            delete data.current_password;
            delete data.new_password;
        }

        const fetchedAdminUpdate = await Admin.query().patchAndFetchById(id, data);
        if (!fetchedAdminUpdate)
            throw ApiError.internal("Something went wrong");

        const response = {
            id: fetchedAdminUpdate.id,
            name: fetchedAdminUpdate.name,
            email: fetchedAdminUpdate.email,
            campaign_id: fetchedAdminUpdate.campaign_id,
            status: fetchedAdminUpdate.status
        };

        return response;
    }

    async deleteAdmin(id) {
        if (!id)
            throw ApiError.badRequest("Admin Id is required!");

        const fetchAdmin = await Admin.query()
            .findById(id)
            .where("is_deleted", "=", 0);

        console.log("admin",fetchAdmin);
        if (!fetchAdmin)
            throw ApiError.badRequest("Admin does not exists!");

        await Admin.query()
            .findById(id)
            .patch({
                is_deleted: true
            });

        return true;
    }

    async adminLogin(data) {
        const { email, password } = data;
        if (!email || !password)
            throw ApiError.badRequest("Enter credentials!");

        const fetchAdmin = await Admin.query()
            .select("*")
            .where("email", "=", email)
            .where("is_deleted", "=", 0);

        if (!fetchAdmin.length)
            throw ApiError.notFound("Admin not found!");

        const verifyPassword = await bcrypt.compare(password, fetchAdmin[0].password);
        if (!verifyPassword)
            throw ApiError.notAuthorized("Invalid password!");

        const admin = {
            id: fetchAdmin[0].id,
            name: fetchAdmin[0].name,
            email: fetchAdmin[0].email,
            campaign_id: fetchAdmin[0].campaign_id,
        }

        return admin;
    }
}

module.exports = new AdminService();