const ApiError = require("../../../utils/apiError");
const Admin = require("../model/Admin.model")
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const knex = require("../../../config/db.config");
const TimeUtils = require("../../../utils/timeUtils");
// const knex = require("");

class AdminService {
    insertValidation(data) {
        if (!data.email || !data.password)
            throw ApiError.badRequest("Email and password are required");

        // if (!data.campaign_id || !data.client_id)
        //     throw ApiError.badRequest("Client id and campaign id are required");

        if (!data.role_id)
            throw ApiError.badRequest("Role id is required");

        return true;
    }

    async getAll() {
        const admins = await Admin.query()
            .select("*")
            .where("is_deleted", "=", 0);

        if (!admins.length)
            throw ApiError.notFound("Admins does not exist!");

        admins.map(admin => {
            delete admin.password;
            delete admin.is_deleted;
        })
        return admins;
    }

    async getById(id) {
        const admin = await Admin.query()
            .findOne({ id: id })
            .where("is_deleted", "=", 0);

        if (!admin)
            throw ApiError.notFound("Admin does not exist!");

        delete admin.password;
        delete admin.is_deleted;

        return admin;
    }

    async findByEmail(email) {
        const admin = await Admin.query().findOne({ email: email, is_deleted: false });
        return admin;
    }

    async newAdmin(data) {
        const isValid = this.insertValidation(data);
        if (!isValid) return;

        const fetchRegisteredEmail = await this.findByEmail(data.email);
        if (fetchRegisteredEmail)
            throw ApiError.alreadyExists("This email is already used!")


        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password, salt);

        let newAdmin = await Admin.query().insert({
            id: uuidv4(),
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            password: hashedPassword,
            campaign_id: data.campaign_id,
            campaign_name: data.campaign_name,
            client_id: data.client_id,
            client_name: data.client_name,
            role_id: data.role_id,
            created_by: data.created_by,
            modified_by: data.modified_by,
        });

        newAdmin.password = undefined;
        newAdmin.is_deleted = undefined;

        return newAdmin;
    }

    async findPassword(id) {
        const { password } = await Admin.query().findById(id).select("password");

        return password;
    }

    async updateAdmin(id, data) {
        if (data.is_deleted)
            throw ApiError.notAuthorized("Cannot re-active the deleted account");

        const fetchAdmin = await this.getById(id);
        if (!fetchAdmin)
            throw ApiError.badRequest("Admin does not exist");

        const fetchAdminPassword = await this.findPassword(id);

        if ("password" in data) {
            // Verify old password:
            // console.log(data.password, fetchAdminPassword);
            // const isValidPassword = await bcrypt.compare(data.password, fetchAdminPassword);
            // if (!isValidPassword)
            //     throw ApiError.notAuthorized("Invalid password");

            // Create new password:
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(data.password, salt);
            data.password = hashedPassword;

            // Delete current password from receiving data from body:
            delete data.password;
            // delete data.new_password;
        }


        data.modified_at = TimeUtils.date();
        const updatedAdmin = await Admin.query().patchAndFetchById(id, data);
        if (!updatedAdmin)
            throw ApiError.internal("Something went wrong");

        delete updatedAdmin.password;
        delete updatedAdmin.is_deleted;

        return updatedAdmin;
    }

    async deleteAdmin(id) {
        if (!id)
            throw ApiError.badRequest("Admin Id is required!");

        const fetchAdmin = await Admin.query()
            .findById(id)
            .where("is_deleted", "=", 0);

        if (!fetchAdmin)
            throw ApiError.badRequest("Admin does not exist!");

        await Admin.query()
            .findById(id)
            .patch({
                is_deleted: true
            });

        return { id: id };
    }

    async adminLogin(data) {
        const { email, password } = data;
        if (!email || !password)
            throw ApiError.badRequest("Enter credentials!");

        const admin = await this.findByEmail(email);

        if (!admin)
            throw ApiError.notFound("Admin not found!");

        const verifyPassword = await bcrypt.compare(password, admin.password);
        if (!verifyPassword)
            throw ApiError.notAuthorized("Invalid password!");

        admin.password = undefined;
        admin.status = undefined;
        admin.is_deleted = undefined;

        return admin;
    }

    async roles() {
        const query = "SELECT id, role FROM roles WHERE is_deleted = 0 AND status = 1";
        const [roles, fields] = await knex.raw(query)

        return roles;
    }
}

module.exports = new AdminService();