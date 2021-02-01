const mongose = require('./index.js');
const Schema = mongose.Schema;

const serviceSchema = new Schema({
    serviceName: { type: String, required: true },
    images: { type: [String], required: true },
    expert: { type: String, required: true },
    content: { type: String, required: true },
    mainSteps: Map,
    subBranches: Map,
    moreOption: Map
}, { timestamps: true })

module.exports = mongose.model('Service', serviceSchema, 'services');