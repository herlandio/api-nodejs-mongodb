const jwt = require("jsonwebtoken");
const { createAccessToken, createRefreshToken } = require("../../auth/tokens");

jest.mock("jsonwebtoken");

describe("Token Generation", () => {
    const user = { _id: "123", role: "admin" };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createAccessToken", () => {
        it("should generate an access token", () => {
            const token = "mockAccessToken";
            jwt.sign.mockReturnValue(token);

            const result = createAccessToken(user);
            expect(result).toBe(token);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user._id, role: user.role },
                process.env.TOKEN,
                { expiresIn: "15m" }
            );
        });

        it("should return null on error", () => {
            jwt.sign.mockImplementation(() => {
                throw new Error("Token creation error");
            });

            const result = createAccessToken(user);
            expect(result).toBeNull();
        });
    });

    describe("createRefreshToken", () => {
        it("should generate a refresh token", () => {
            const token = "mockRefreshToken";
            jwt.sign.mockReturnValue(token);

            const result = createRefreshToken(user);
            expect(result).toBe(token);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user._id },
                process.env.REFRESH_TOKEN,
                { expiresIn: "20m" }
            );
        });

        it("should return null on error", () => {
            jwt.sign.mockImplementation(() => {
                throw new Error("Token creation error");
            });

            const result = createRefreshToken(user);
            expect(result).toBeNull();
        });
    });
});
