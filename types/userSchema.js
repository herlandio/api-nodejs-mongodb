const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Tipos de dados e tratamento
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: [true, 'Qual o seu nome?']
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
            message: "Insira um email valido!"
        },
        required: [true, 'Qual o seu email?']
    },
    password: {
        type: String,
        minlength: [6, "O tamanho minimo é 6 caracteres!"],
        maxlength: [12, "O tamanho maximo é 12 caracteres!"],
        required: [true, 'Crie uma senha?']
    }
},{
    collection:'users',
    versionKey: false
});

/**
 * Antes de salvar gera hash de senha
 */
userSchema.pre("save", async function (next) {
    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    return next();
});

module.exports = mongoose.model('user', userSchema);