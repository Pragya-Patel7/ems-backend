const ApiError = require("../../../utils/apiError");
const Campaign = require("../model/Campaign.model")
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

class CampaignService {
    async getAll() {
        const campaigns = await Campaign.query()
            .select("*")
            .where("is_deleted", "=", 0);

        if (!campaigns)
            throw ApiError.notFound("campaigns does not exists!");

        let campaignArr = [];
        campaigns.map(campaign => {
            let obj = {
                id: campaign.id,
                name: campaign.name,
                email: campaign.email,
                status: campaign.status,
            }
            campaignArr.push(obj);
        })
        return campaignArr;
    }

    async getById(id) {
        const campaign = await Campaign.query()
            .select("*")
            .where("id", "=", id)
            .where("is_deleted", "=", 0);

        if (!campaign.length)
            throw ApiError.notFound("Campaign does not exists!");

        const response = {
            id: campaign.id,
            name: campaign.name,
            email: campaign.email,
            status: campaign.status
        }
        return response;
    }

    async newCampaign(data) {
        const fetchWithEmail = await Campaign.query()
            .select("email")
            .where("email", "=", data.email);

        if (fetchWithEmail.length)
            throw ApiError.alreadyExists("This email is already used!")

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newCampaign = await Campaign.query().insert({
            id: uuidv4(),
            name: data.name,
            email: data.email,
            password: hashedPassword,
            status: data.status,
            is_deleted: false,
        });

        const campaign = {
            id: newCampaign.id,
            name: newCampaign.name,
            email: newCampaign.email,
            status: newCampaign.status,
        }

        return campaign;
    }

    async updateCampaign(id, data) {
        if ("is_deleted" in data)
            throw ApiError.notAuthorized("Cannot re-active the deleted account");

        if ("password" in data)
            throw ApiError.notAuthorized("Cannot change password here...");

        const fetchCampaign = await Campaign.query()
            .select("*")
            .where("id", "=", id)
            .where("is_deleted", "=", 0);

        if (!fetchCampaign.length)
            throw ApiError.badRequest("Campaign does not exists!");

        const fetchedCampaignUpdate = await Campaign.query().patchAndFetchById(id, data);
        if (!fetchedCampaignUpdate)
            throw ApiError.internal();

        const response = {
            id: fetchedCampaignUpdate.id,
            name: fetchedCampaignUpdate.name,
            email: fetchedCampaignUpdate.email,
            status: fetchedCampaignUpdate.status
        };

        return response;
    }

    async deleteCampaign(id) {
        if (!id)
            throw ApiError.badRequest("Campaign Id is required!");

        const deleteCampaign = await Campaign.query()
            .findById(id)
            .patch({
                is_deleted: true
            });

        return true;
    }

    async campaignLogin(data) {
        const { email, password } = data;
        if (!email || !password)
            throw ApiError.badRequest("Enter credentials!");

        const fetchCampaign = await Campaign.query()
            .select("*")
            .where("email", "=", email)
            .where("is_deleted", "=", 0);

        if (!fetchCampaign.length)
            throw ApiError.notFound("Incorrect email address!");

        const verifyPassword = bcrypt.compare(password, fetchCampaign[0].password);
        if (!verifyPassword)
            throw ApiError.notAuthorized("Invalid password!");

        const campaign = {
            id: fetchCampaign[0].id,
            name: fetchCampaign[0].name,
            email: fetchCampaign[0].email,
            status: fetchCampaign[0].status,
        }

        return campaign;
    }
}

module.exports = new CampaignService();