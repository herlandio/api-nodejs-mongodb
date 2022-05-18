var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../types/userSchema');
const {success, fail} = require('../help/messages');
const { createAccessToken, createRefreshToken } = require('../auth/tokens');
let refreshTokens = [];

/**
 * Mensagem de boas vindas
 */
router.get('/', function (req, res) {

    /*
    * #swagger.responses[200]
    */
    success(res, 'Welcome to api test MyPharma', 200, 'success', 'welcome'); 

});


/**
 * Criação de usúario
 */
router.post('/create', async function (req, res) {

    const { name, email, password } = req.body;
    const boxError = [];

    User.findOne({ email: email }, function (err, result) {
        if(result === null){
            const user = new User();
            user._id = uuidv4();
            user.name = name;
            user.email = email;
            user.password = password;

            user.save(function (err) {
                if (err) {
                    for(let field in err.errors) {
                        boxError.push({field: err.errors[field].message});
                    }

                    /*
                    * #swagger.responses[400]
                    */
                    fail(res, boxError, 400, 'bad request');
                } else {

                    /*
                    * #swagger.responses[201]
                    */
                    success(res, {
                        name: name,
                        email: email
                    }, 201, 'success', 'created');
                }
            });
        } else {

            /*
            * #swagger.responses[400]
            */
            fail(res, 'O email já existe em nossos sistemas, tente outro', 400, 'bad request');
        }
    });
});

/**
 * Login e geração de tokens de acesso a api
 */
router.post('/login', function (req, res) {
    const { email, password } = req.body;

    User.findOne({email: email}, async function (err, results) {
        if (results === null) {

            /*
            * #swagger.responses[400]
            */
            fail(res, `user doesn't exists`, 400, 'bad request');
        } else {
            const match  = await bcrypt.compare(password, results.password);
            if (match) {

                const refreshToken = createRefreshToken({name: results.name, email: results.email});
                const token = createAccessToken({name: results.name, email: results.email});

                /*
                * #swagger.responses[200]
                */
                success(res, {
                    name: results.name,
                    email: results.email,
                    accessToken: token,
                    refreshToken: refreshToken
                }, 200, 'success', 'logged');

                refreshTokens.push(refreshToken);
            } else {

                /*
                * #swagger.responses[401]
                */
                fail(res, 'Senha ou email incorretos!', 401, 'unauthorized');
            }
        }
    })
});

/**
 * Atualização de tokens de acesso
 */
router.post("/refreshToken", (req, res) => {
    const { token, name, email } = req.body;

    if (!refreshTokens.includes(token)) {
        
        /*
        * #swagger.responses[401]
        */
        fail(res, 'Refresh Token Invalid', 401, 'bad request');
    } else {
        refreshTokens = refreshTokens.filter( (c) => c != token);

        /*
        * #swagger.responses[200]
        */
        success(res, {
            accessToken: createAccessToken({name: name, email: email}),
            refreshToken: createRefreshToken({name: name, email: email})
        }, 200, 'success', 'refreshed');
    }
});

/**
 * Logout da api
 */

router.post('/logout', function (req, res) {
       
    const { token } = req.body;

    refreshTokens = refreshTokens.filter( (c) => c != token);
    
    /*
    * #swagger.responses[200]
    */
    success(res, '', 200, 'success', 'Logged out!');

});

module.exports = router;
