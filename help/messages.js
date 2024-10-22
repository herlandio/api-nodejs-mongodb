/**
 * Generates a success message
 * @param {Object} res - HTTP response
 * @param {Object|Array} data - Data to be sent in the response
 * @param {number} code - HTTP status code
 * @param {string} status - Response status (e.g., "success")
 * @param {string} successMessage - Success message
 */
const success = (res, data, code, status, successMessage) => {
    return res.status(code).send({
        data: data,
        code: code,
        status: status,
        message: successMessage
    });
}

/**
 * Generates an error message
 * @param {Object} res - HTTP response
 * @param {Array} boxError - List of errors
 * @param {number} code - HTTP status code
 * @param {string} status - Response status (e.g., "error")
 */
const fail = (res, boxError, code, status) => {
    return res.status(code).send({
        code: code,
        status: status,
        message: boxError
    });
}

module.exports = { success, fail }
