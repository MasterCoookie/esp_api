const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    owners: [Schema.Types.ObjectId],
    name: String,
});

const Device = mongoose.model('model', deviceSchema);

module.exports = Device;