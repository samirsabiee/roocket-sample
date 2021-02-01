const { hash } = require('bcrypt');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    admin: { type: Boolean, default: 0 },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.plugin(mongoosePaginate);

userSchema.statics.hashPassword = password => {
    let hash = bcrypt.hashSync(password, bcrypt.genSaltSync(15));
    return hash;
}

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.statics.createToken = async function(user, secret, expiresIn) {
    let { id, email } = user;
    return await jwt.sign({ id, email }, secret, { expiresIn });
}

userSchema.statics.checkToken = async function(req) {
    let token = req.headers['x-token'];
    if (token) {
        try {
            return await jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (e) {
            throw new AuthenticationError('Your Token expierd, login again');
        }
    } else {
        return undefined;
    }
}

userSchema.virtual('articles', {
    ref: 'Article',
    localField: '_id',
    foreignField: 'user'
})

module.exports = mongoose.model('User', userSchema);