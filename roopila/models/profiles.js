const mongose = require('./index.js');
const Schema = mongose.Schema;

const profileSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    address: Map,
    melicode: String,
    gender: String,
    avatar: String,
    birthDate: String,
    businessField: String,
    bio: String,
    website: String,
    socialMedia: Map,
    accountType: String,
    companyName: String,
    companyId: String,
    companyBranchAddress: Map,
    companyManagerName: String,
    companyField: String,
    companyPhone: String,
    companyFax: String,
    profileStatus: Number
}, { timestamps: true })

profileSchema.virtual('users', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id'
});

module.exports = mongose.model('UserProfile', profileSchema, 'profiles');