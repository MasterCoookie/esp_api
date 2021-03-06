const User = require('../models/userModel');
const Device = require('../models/deviceModel');
const DeviceEvent = require('../models/deviceEventModel');

const get_user_devices = async (req, res) => {
    const { _id } = res.locals.user;

    try {
        const devices = await Device.find({ owners: _id });
        if(devices) {
            res.status(200).json({ devices });
        } else {
            res.status(204);
            res.end();
        }
    } catch (err) {
        console.log(err);
        res.status(400);
        res.end();
    }
}

const regiser_device = async (req, res) => {
    const { name } = req.body;
    const ownerID = res.locals.user._id;
    
    try {
        const registeredDevice = await Device.create({ owners: [ownerID], name });
        console.log("New device %s registered by %s", name, res.locals.user.email);
        await User.findByIdAndUpdate(ownerID , { "$push": { devicesList: registeredDevice._id } });
        res.status(201);
        res.end();
    } catch(err) {
        console.log(err);
        res.status(400);
        res.end();
    }
}

const get_device_events = async (req, res) => {
    const { deviceID } = req.body;

    DeviceEvent.find({ deviceID }).then(result => {
        res.status(200).json({ events: result });
    }).catch(err => {
        res.status(400);
        console.log(err);
        res.end();
    });
}

const add_device_owner = async (req, res) => {
    const { ownerID, deviceID } = req.body;

    await Device.findByIdAndUpdate(deviceID, { "$push": { owners: ownerID } }).then(() => {
        res.status(200);
        res.end();
    }).catch(err => {
        console.log(err);
        res.status(400);
        res.end();
    });
}

const check_pending_event = async (req, res) => {
    const { deviceID } = req.body;
    const curr_time = Date.now();

    const time_limit = new Date(curr_time + 300000);
    const event = await DeviceEvent.find({ deviceID,
        eventTime : { $gt: curr_time, $lt: time_limit },
    }, null, {
        skip: 0,
        limit: 1,
        sort: {
            eventTime: 1
        }
    }).catch(err => {
        res.status(400);
        console.log(err);
        res.end();
    });
    if(event[0]) {
        await Device.findByIdAndUpdate(deviceID, { pendingEventID: event[0]._id });
        res.status(200).json({ event: event[0] });
    } else {
        res.status(204).json({ event: null });
        console.log("Not found ");
    }
}


module.exports = {
    regiser_device,
    get_device_events,
    add_device_owner,
    check_pending_event,
    get_user_devices
}