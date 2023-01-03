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
                mobile: admin.mobile,
            }
            adminArr.push(obj);
        })
        return adminArr;
    }

    async getById(id) {
        const admin = await Admin.query()
            .select("*")
            .where("id", "=", id)
            .where("is_deleted", "=", 0);

        if (!admin.length)
            throw ApiError.notFound("Admin does not exists!");
 
        return admin;
    }

    async newAdmin(data) {
        const fetchWithEmail = await Admin.query()
            .select("email")
            .where("email", "=", data.email);

        if (fetchWithEmail.length)
            throw ApiError.alreadyExists("This email is already used!")

        const fetchWithMobile = await Admin.query()
            .select("mobile")
            .where("mobile", "=", data.mobile);

        if (fetchWithMobile.length)
            throw ApiError.alreadyExists("This mobile no. is already used!")

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newAdmin = await Admin.query().insert({
            id: uuidv4(),
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            password: hashedPassword,
            is_deleted: false,
        });

        const admin = {
            id: newAdmin.id,
            name: newAdmin.name,
            email: newAdmin.email,
            mobile: newAdmin.mobile,
        }

        return admin;
    }

    async updateAdmin(id, data) {
        if ("is_deleted" in data)
            throw ApiError.notAuthorized("Cannot re-active the deleted account");

        if ("password" in data)
            throw ApiError.notAuthorized("Cannot change password here...");

        const fetchAdmin = await Admin.query()
            .select("*")
            .where("id", "=", id)
            .where("is_deleted", "=", 0);
        
        if (!fetchAdmin.length)
            throw ApiError.badRequest("Admin does not exists!");

        const fetchedAdminUpdate = await Admin.query().patchAndFetchById(id, data);
        if (!fetchedAdminUpdate)
            throw ApiError.internal("Something went wrong");

        const response = {
            id: fetchedAdminUpdate.id,
            name: fetchedAdminUpdate.name,
            email: fetchedAdminUpdate.email,
            mobile: fetchedAdminUpdate.mobile
        };

        return response;
    }

    async deleteAdmin(id) {
        if (!id)
            throw ApiError.badRequest("Admin Id is required!");

        const fetchAdmin = await Admin.query()
            .select("*")
            .where("id", "=", id)
            .where("is_deleted", "=", 0);

        if (!fetchAdmin.length)
            throw ApiError.badRequest("Admin does not exists!");
        
        const deleteAdmin = await Admin.query()
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

        if (!fetchAdmin)
            throw ApiError.notFound("Admin not found!");

        const verifyPassword = bcrypt.compare(password, fetchAdmin[0].password);
        if (!verifyPassword)
            throw ApiError.notAuthorized("Invalid password!");

        const admin = {
            name: fetchAdmin[0].name,
            email: fetchAdmin[0].email,
            mobile: fetchAdmin[0].mobile,
        }

        return admin;
    }
}

module.exports = new AdminService();