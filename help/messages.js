/**
 * Geração de messagem sucesso
 * @param res
 * @param data
 * @param code
 * @param status
 * @param message
 */
const success = (res, data, code, status, message) => {
    res.status(code).send({
        data: data,
        code: res.statusCode,
        status: status,
        message: message
    }).end();
}

/**
 * Geração de erro sucesso
 * @param res
 * @param boxError
 * @param code
 * @param status
 */
const fail = (res, boxError, code, status) => {
    res.status(code).send({
        code: res.statusCode,
        status: status,
        message: boxError
    }).end();
}

module.exports = { success, fail }