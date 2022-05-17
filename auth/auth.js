const jwt = require("jsonwebtoken");
const {fail} = require('../help/messages');

/**
 * Verifica token de acesso
 * @param req
 * @param res
 * @param next
 * @constructor
 */
const Authorization = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (typeof authHeader === 'undefined' ) {
        fail(res, 'bearer token not found', 400, 'bad request');
    } else {
        const token = authHeader.split(" ")[1];
        if (token == null) {
            fail(res, 'token not found', 400, 'bad request');
        } else {
            jwt.verify(token, process.env.TOKEN, (err, user) => {
                if (err) {
                    fail(res, 'invalid token', 400, 'bad request');
                } else {
                    req.user = user;
                    next();
                }
            });
        }
    }
}

module.exports = Authorization;