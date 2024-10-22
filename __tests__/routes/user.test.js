const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const userRoutes = require('../../routes/users');
const app = express();

app.use(express.json());
app.use('/api', userRoutes);

jest.mock('../../types/userSchema', () => {
    return {
        findOne: jest.fn(),
        prototype: {
            save: jest.fn(),
        },
    };
});

const User = require('../../types/userSchema');

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET / - should return welcome message', async () => {
        const response = await request(app).get('/api/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            data: 'Welcome to api test MyPharma',
            message: 'welcome',
            status: 'success',
            code: 200,
        });
    });

     test('POST /create - should create a new user', async () => {
        const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password' };

        let u = User.findOne.mockResolvedValue(null);
        if (u === null) {
            const response = await request(app).post('/api/create').send(newUser);
            User.prototype.save = jest.fn().mockResolvedValue(newUser);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                data: { name: 'John Doe', email: 'john@example.com' },
                code: 201,
                status: 'success',
                message: 'created',
            });
        }
    });

    test('POST /login - should log in a user and return tokens', async () => {
        const mockUser = { email: 'john@example.com', password: await bcrypt.hash('hashedpassword', 10), name: 'John Doe' };
        User.findOne.mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'john@example.com', password: 'hashedpassword' });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
    });

    test('POST /logout - should logout a user', async () => {
        const token = 'some-refresh-token';
        const response = await request(app).post('/api/logout').send({ token });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Logged out!',
            data: "",
            status: 'success',
            code: 200,
        });
    });
});
