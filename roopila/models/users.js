const mongose = require('./index.js');
const Schema = mongose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    role: { type: Number, required: true }
}, { timestamps: true })

userSchema.plugin(mongoosePaginate);

module.exports = mongose.model('User', userSchema, 'users');