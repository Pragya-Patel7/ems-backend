require("dotenv").config();
const jwt = require("jsonwebtoken");
const ApiError = require("./apiError");
const randomText = require("./randomText");

const SECRET = process.env.ACCESS_TOKEN_SECRET;
const randomString = randomText(6);

class JwtUtils {
    static generateToken(user) {
        const days = 30;
        const token = jwt.sign({ data: user }, SECRET, {
            algorithm: "HS256",
            expiresIn: (60 * 60) * (24 * days),
        });

        // Adding random string to token for encryption:
        const encryptedToken = token + randomString;
        return encryptedToken;
    }

    static verifyToken(token) {
        // Removing randomString from token:
        token = token.substring(0, token.length - 6);

        let result = null;
        jwt.verify(token, SECRET, {
            algorithms: ["HS256"],
            type: "JWT"
        }, (err, user) => {
            if (err)
                throw ApiError.notAuthorized();

            result = user;
        })

        return result;
    }

    static destroyToken(token) {
        // Removing randomString from token:
        token = token.substring(0, token.length - 5);

        jwt.sign({ data: token }, "", { expiresIn: 1 }, (logout, err) => {
            if (err)
                return false;
        })

        return true;
    }
};

module.exports = JwtUtils;