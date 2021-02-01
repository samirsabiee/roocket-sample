const mongose = require('./index.js');
const Schema = mongose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const newsSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: { type: Map, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    tags: [String],
    views: Number
}, { timestamps: true })

newsSchema.plugin(mongoosePaginate);

newsSchema.virtual('categories', {
    ref: 'Category',
    localField: 'categoryId',
    foreignField: '_id'
});

module.exports = mongose.model('News', newsSchema, 'news');