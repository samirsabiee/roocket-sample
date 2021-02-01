const mongose = require('./index.js');
const Schema = mongose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const paymentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },
    order_id: { type: Schema.Types.ObjectId, required: true },
    user_ip: { type: String, required: true },
    pursuitNumber: { type: String, required: true },
    amountPay: { type: Number, required: true },
    paymentStatus: { type: Number, required: true },
    cardNumber: { type: Number, required: true },
    cardShaba: { type: String, required: true },
    bankPortId: { type: Number, required: true }
}, { timestamps: true })

paymentSchema.plugin(mongoosePaginate);

paymentSchema.virtual('users', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id'
});

paymentSchema.virtual('orders', {
    ref: 'Order',
    localField: 'order_id',
    foreignField: '_id'
});

module.exports = mongose.model('Payment', paymentSchema, 'payments');