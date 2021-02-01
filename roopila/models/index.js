const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost:27017/roopila', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.Promise = global.Promise;
}