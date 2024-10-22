const jwt = require("jsonwebtoken");
const Authorization = require("../../auth/auth");
const { fail } = require('../../help/messages');

jest.mock("jsonwebtoken");
jest.mock('../../help/messages');

describe("Authorization Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it("should return 401 if Bearer token not found", () => {
        Authorization(req, res, next);
        expect(fail).toHaveBeenCalledWith(res, 'Bearer token not found', 401, 'unauthorized');
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token not found", () => {
        req.headers.authorization = "Bearer ";
        Authorization(req, res, next);
        expect(fail).toHaveBeenCalledWith(res, 'Token not found', 401, 'unauthorized');
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", () => {
        req.headers.authorization = "Bearer invalidtoken";
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error("Invalid token"), null);
        });

        Authorization(req, res, next);
        expect(fail).toHaveBeenCalledWith(res, 'Invalid token', 401, 'unauthorized');
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if token is valid", () => {
        const mockUser = { id: 1, name: "Test User" };
        req.headers.authorization = "Bearer validtoken";
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockUser);
        });

        Authorization(req, res, next);
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });
});
