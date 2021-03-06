const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    owners: [Schema.Types.ObjectId],
    name: String,
    pendingEventID: {
        type: Schema.Types.ObjectId,
        default: null
    }
});

const Device = mongoose.model('device', deviceSchema);

module.exports = Device;