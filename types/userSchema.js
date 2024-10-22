const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/**
 * User schema definition
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true
    },
    name: {
        type: String,
        required: [true, 'What is your name?']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email!"
        },
        required: [true, 'What is your email?']
    },
    password: {
        type: String,
        minlength: [6, "The minimum length is 6 characters!"],
        maxlength: [12, "The maximum length is 12 characters!"],
        required: [true, 'Create a password?']
    }
}, {
    collection: 'users',
    versionKey: false
});

/**
 * Before saving, generates a hash of the password
 */
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
