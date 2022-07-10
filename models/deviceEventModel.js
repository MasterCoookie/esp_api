const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceEventSchema = new Schema({
    deviceID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    //TOOD: check for colliding events
    eventTime: Date,
    targetYpos: Number,
}, { timestamps: true });
//TODO: event repetition

const deviceEvent = mongoose.model('deviceEvent', deviceEventSchema);

module.exports = deviceEvent;