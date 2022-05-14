const jwt = require("jsonwebtoken");

/**
 * Criação de token
 * @param user
 * @returns {undefined|*}
 */
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.TOKEN, {expiresIn: "15m"});
}

/**
 * Atualização de token
 * @param user
 * @returns {undefined|*}
 */
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn: "20m"});
}

module.exports = {
    createAccessToken, createRefreshToken
}