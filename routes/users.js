var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../types/userSchema');
const { success, fail } = require('../help/messages');
const { createAccessToken, createRefreshToken } = require('../auth/tokens');
let refreshTokens = [];

/**
 * Welcome message
 */
router.get('/', function (req, res) {
    success(res, 'Welcome to api test MyPharma', 200, 'success', 'welcome'); 
});

/**
 * User creation
 */
router.post('/create', async function (req, res) {
    const { name, email, password } = req.body;
    const boxError = [];

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser === null) {
            const user = new User({
                name: name,
                email: email,
                password: password,
            });

            await user.save();
            /*
            * #swagger.responses[201]
            */
            return success(res, { name: name, email: email }, 201, 'success', 'created');
        } else {
            /*
            * #swagger.responses[400]
            */
            return fail(res, 'The email already exists in our systems, try another', 400, 'bad request');
        }
    } catch (err) {
        if (err.errors) {
            for (let field in err.errors) {
                boxError.push({ field: err.errors[field].message });
            }
            /*
            * #swagger.responses[400]
            */
            return fail(res, boxError, 400, 'bad request');
        } else {
            /*
            * #swagger.responses[500]
            */
            return fail(res, 'Internal server error', 500, 'internal server error');
        }
    }
});

/**
 * Login and generation of access tokens
 */
router.post('/login', async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (user === null) {
            /*
            * #swagger.responses[400]
            */
            return fail(res, `User doesn't exist`, 400, 'bad request');
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const refreshToken = createRefreshToken({ name: user.name, email: user.email });
            const token = createAccessToken({ name: user.name, email: user.email });

            /*
            * #swagger.responses[200]
            */
            success(res, {
                name: user.name,
                email: user.email,
                accessToken: token,
                refreshToken: refreshToken
            }, 200, 'success', 'logged');

            refreshTokens.push(refreshToken);
        } else {
            /*
            * #swagger.responses[401]
            */
            return fail(res, 'Incorrect password or email!', 401, 'unauthorized');
        }
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        return fail(res, 'Internal server error', 500, 'internal server error');
    }
});

/**
 * Access token refresh
 */
router.post("/refreshToken", (req, res) => {
    const { token, name, email } = req.body;

    if (!refreshTokens.includes(token)) {
        /*
        * #swagger.responses[401]
        */
        return fail(res, 'Refresh Token Invalid', 401, 'unauthorized');
    }

    refreshTokens = refreshTokens.filter((c) => c !== token);
    const newAccessToken = createAccessToken({ name, email });
    const newRefreshToken = createRefreshToken({ name, email });

    return success(res, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }, 200, 'success', 'refreshed');
});

/**
 * API logout
 */
router.post('/logout', (req, res) => {
    const { token } = req.body;

    if (!token) {
        /*
        * #swagger.responses[400]
        */
        return fail(res, 'Token is required', 400, 'bad request');
    }

    refreshTokens = refreshTokens.filter((c) => c !== token);
    /*
    * #swagger.responses[200]
    */
    return success(res, '', 200, 'success', 'Logged out!');
});

module.exports = router;
