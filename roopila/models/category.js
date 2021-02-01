const mongose = require('./index.js');
const Schema = mongose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true }
}, { timestamps: true })

module.exports = mongose.model('Category', categorySchema, 'categories');