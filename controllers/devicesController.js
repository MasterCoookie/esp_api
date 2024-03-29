const User = require('../models/userModel');
const Device = require('../models/deviceModel');
const DeviceEvent = require('../models/deviceEventModel');

//use .valueOf() when using in response
const date_to_timestamp = (date) => {
    return Math.floor(new Date(date).valueOf() / 1000);
}

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
    const { deviceID, getTimeAsTimestamp } = req.body;

    DeviceEvent.find({ deviceID }).then(result => {
        if(!getTimeAsTimestamp) {
            res.status(200).json({ events: result });
        } else {
            let events = []
            result.forEach(event => {
                const eventTimeAsTimestamp = date_to_timestamp(event.eventTime);
                events.push({
                    "_id": event._id,
                    "eventTime": eventTimeAsTimestamp.valueOf(),
                    "targetYpos": event.targetYpos,
                    "repeated": event.repeatable,
                    "repeat":  event.repeat
                });
            });
            res.status(200).json({ events });
        }
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

//server is 2h behind for some reason
const check_pending_event = async (req, res) => {
    const { deviceID, getTimeAsTimestamp, getDummyData } = req.body;
    const curr_time = Date.now();
    //console.log(curr_time);
    if(getDummyData) {
        res.status(200).json({
            event: {
                _id: "62cd4c376d7ce0f4f60becac",
                eventTime: Math.floor((curr_time.valueOf() / 1000) + 60),
                targetYpos: 3000,
                repeatable: true
            }
        });
        return;
    }

    const time_limit = new Date(curr_time + 300000);
    const event = await DeviceEvent.find({ deviceID,
        eventTime : { $gt: curr_time - 500, $lt: time_limit },
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
        // console.log(eventTimeAsTimestamp);
        if(!getTimeAsTimestamp) {
            res.status(200).json({ event: event[0] });
        } else {
        const eventTimeAsTimestamp = date_to_timestamp(event[0].eventTime);
        // event[0].eventTime = eventTimeAsTimestamp.valueOf();
            res.status(200).json({
                event: {
                    _id: event[0]._id,
                    eventTime: eventTimeAsTimestamp.valueOf(),
                    targetYpos: event[0].targetYpos,
                    repeatable: event[0].repeatable
                }
            });
        }
    } else {
        res.status(204).json({ event: null });
        console.log("Not found ");
    }
}

const get_device_by_mac = async (req, res) => {
    const { MAC } = req.body;
    // console.log(req.body);
    console.log("New mac %s req", MAC);

    const device = await Device.findOne({ MAC: MAC }).catch(err => {
        res.status(400);
        console.log(err);
        res.end();
    });

    if(!device) {
        res.status(204);
        res.end();
    }

    res.status(200).json({ device: {
        _id: device._id,
        name: device.name,
        motorSpeed: device.motorSpeed,
        YPosClosed: device.YPosClosed,
    }})
}

const update_device = async (req, res) => {
    const { name, deviceID, motorSpeed, wifiName, wifiPassword, YPosClosed } = req.body;
    try{
        const oldDevice = Device.findById(deviceID);
        if(!oldDevice) {
            res.status(404);
            res.end();
        }
        
        await Device.findByIdAndUpdate(deviceID, {
            name: name ? name : oldDevice.name,
            motorSpeed: motorSpeed ? motorSpeed : oldDevice.motorSpeed,
            wifiName: wifiName ? wifiName : oldDevice.wifiName,
            wifiPassword: wifiPassword ? wifiPassword : oldDevice.wifiPassword,
            YPosClosed: YPosClosed ? YPosClosed : oldDevice.YPosClosed,
        });
    
        res.status(200);
        res.end();
    } catch(e) {
        res.status(500);
        res.end();
    }

    
}


module.exports = {
    regiser_device,
    get_device_events,
    add_device_owner,
    check_pending_event,
    get_user_devices,
    get_device_by_mac,
    update_device
}