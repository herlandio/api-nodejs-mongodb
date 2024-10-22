const jwt = require("jsonwebtoken");
const { fail } = require('../help/messages');

/**
 * Authorization middleware to verify the access token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Function to pass control to the next middleware
 */
const Authorization = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return fail(res, 'Bearer token not found', 401, 'unauthorized');
    }
    
    const token = authHeader.split(" ")[1];
    
    if (!token) {
        return fail(res, 'Token not found', 401, 'unauthorized');
    }
    
    jwt.verify(token, process.env.TOKEN, (err, user) => {
        if (err) {
            console.error("Token verification error:", err);
            return fail(res, 'Invalid token', 401, 'unauthorized');
        }
        
        req.user = user;
        next();
    });
}

module.exports = Authorization;
