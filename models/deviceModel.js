const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    owners: [Schema.Types.ObjectId],
    MAC: String,
    name: String,
    motorSpeed: {
        type: Number,
        default: 25
    },
    wifiName: {
        type: String,
        default: null
    },
    wifiPassword: {
        type: String,
        default: null
    },
    pendingEventID: {
        type: Schema.Types.ObjectId,
        default: null
    },
    YPosClosed: {
        type: Number,
        default: 0
    }
});

const Device = mongoose.model('device', deviceSchema);

module.exports = Device;