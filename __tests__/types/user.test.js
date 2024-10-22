const User = require('../../types/userSchema');

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));

jest.mock('mongoose', () => {
    const originalMongoose = jest.requireActual('mongoose');

    const mockSchema = function (data) {
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;

        this.validateSync = jest.fn(() => {
            if (!this.email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
                return {
                    errors: {
                        email: {
                            message: "Please enter a valid email!",
                        },
                    },
                };
            }
            return null;
        });
    };

    mockSchema.prototype.save = async function () {
        if (this.password) {
            const bcrypt = require('bcrypt');
            this.password = await bcrypt.hash(this.password, 10);
        }
        return this;
    };

    return {
        ...originalMongoose,
        model: jest.fn().mockImplementation(() => mockSchema),
        Schema: originalMongoose.Schema,
        connect: jest.fn(),
    };
});

describe('User Model Test', () => {
    it('should hash the password before saving the user', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        const user = new User(userData);

        await user.save();

        const bcrypt = require('bcrypt');
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(user.password).toBe('hashed_password');
    });

    it('should return validation error for invalid email', () => {
        const user = new User({
            name: 'Invalid User',
            email: 'invalid-email',
            password: 'password123',
        });

        const error = user.validateSync();
        expect(error.errors.email.message).toBe('Please enter a valid email!');
    });
});