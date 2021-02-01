const mongose = require('./index.js');
const Schema = mongose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const orderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },
    itemName: { type: String, required: true },
    itemCount: { type: Number, required: true },
    itemWeight: { type: String, required: true },
    itemVolume: { type: String, required: true },
    itemSample: { type: Map, required: true },
    status: { type: Number, required: true },
    inquiryAmount: Number,
    finalAmount: Number
}, { timestamps: true })

orderSchema.plugin(mongoosePaginate);

orderSchema.virtual('users', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id'
});

module.exports = mongose.model('Order', orderSchema, 'orders');