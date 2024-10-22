const { success, fail } = require('../../help/messages');

describe('Response Utilities', () => {
    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    describe('success', () => {
        it('should return a success response with correct properties', () => {
            const data = { key: 'value' };
            const code = 200;
            const status = 'success';
            const successMessage = 'Operation completed successfully';

            success(res, data, code, status, successMessage);

            expect(res.status).toHaveBeenCalledWith(code);
            expect(res.send).toHaveBeenCalledWith({
                data: data,
                code: code,
                status: status,
                message: successMessage
            });
        });
    });

    describe('fail', () => {
        it('should return an error response with correct properties', () => {
            const boxError = ['Error 1', 'Error 2'];
            const code = 400;
            const status = 'error';

            fail(res, boxError, code, status);

            expect(res.status).toHaveBeenCalledWith(code);
            expect(res.send).toHaveBeenCalledWith({
                code: code,
                status: status,
                message: boxError
            });
        });
    });
});
