require('dotenv').config();
const mongoose = require('mongoose');

jest.mock('mongoose');

describe('MongoDB Connection', () => {
    beforeAll(() => {
        process.env.USER = 'testUser';
        process.env.PASS = 'testPass';
        process.env.DB = 'testDB';
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should connect to MongoDB successfully', async () => {
        mongoose.connect.mockResolvedValueOnce();

        const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.4zr4a.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        expect(mongoose.connect).toHaveBeenCalledWith(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    it('should handle connection errors', async () => {
        const errorMessage = 'Connection error';
        mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

        const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.4zr4a.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

        await expect(mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })).rejects.toThrow(errorMessage);
    });
});
