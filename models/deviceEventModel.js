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
    repeatable: Boolean,
    //index 0 represents sunday, 1 monday and so on
    repeat: [Boolean]
}, { timestamps: true });


const deviceEvent = mongoose.model('deviceEvent', deviceEventSchema);

module.exports = deviceEvent;