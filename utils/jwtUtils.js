require("dotenv").config();
const jwt = require("jsonwebtoken");
const ApiError = require("./apiError");

const secret = process.env.ACCESS_TOKEN_SECRET;

class JwtUtils {
    static generateToken(user) {
        const days = 30;
        const token = jwt.sign({ data: user }, "k308OnQ4xOZiRahuLjYg+Jg7EiFkpypRbXQEbBtGwuKQ=", {
            algorithm: "HS256",
            expiresIn: (60 * 60) * (24 * days),
        });

        return token;
    }

    static verifyToken(token) {
        let result = null;
        jwt.verify(token, "k308OnQ4xOZiRahuLjYg+Jg7EiFkpypRbXQEbBtGwuKQ=", {
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
        jwt.sign({ data: token }, "", { expiresIn: 1 }, (logout, err) => {
            if (err)
                return false;
        })

        return true;
    }
};

module.exports = JwtUtils;