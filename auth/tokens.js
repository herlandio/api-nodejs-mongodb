const jwt = require("jsonwebtoken");

/**
 * Generates an access token
 * @param {Object} user - User information
 * @returns {string|null} - Returns the access token or null in case of an error
 */
const createAccessToken = (user) => {
    try {
        const payload = {
            id: user._id, 
            role: user.role 
        };
        return jwt.sign(payload, process.env.TOKEN, { expiresIn: "15m" });
    } catch (error) {
        console.error("Error creating access token:", error);
        return null;
    }
}

/**
 * Generates a refresh token
 * @param {Object} user - User information
 * @returns {string|null} - Returns the refresh token or null in case of an error
 */
const createRefreshToken = (user) => {
    try {
        const payload = {
            id: user._id 
        };
        return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "20m" });
    } catch (error) {
        console.error("Error creating refresh token:", error);
        return null;
    }
}

module.exports = {
    createAccessToken,
    createRefreshToken
}
