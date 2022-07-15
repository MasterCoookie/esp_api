const User = require('../models/userModel');
const Device = require('../models/deviceModel');
const DeviceEvent = require('../models/deviceEventModel');


const regiser_device = async (req, res) => {
    const { ownerID, name } = req.body;
    
    try {
        const registeredDevice = await Device.create({ owners: [ownerID] ,name });
        console.log("New device %s registered by %s", name, ownerID);
        await User.findByIdAndUpdate(ownerID , { "$push": { devicesList: registeredDevice._id } });
        res.status(201).json({ success: true })
    } catch(err) {
        console.log(err);
        res.status(400).json({ success: false });
    }
}

const get_device_events = async (req, res) => {
    const { deviceID } = req.body;

    DeviceEvent.find({ deviceID }).then(result => {
        res.status(200).json({ events: result });
    }).catch(err => {
        console.log(err);
    });
}

const add_device_owner = async (req, res) => {
    const { ownerID, deviceID } = req.body;

    await Device.findByIdAndUpdate(deviceID, { "$push": { owners: ownerID } }).then(() => {
        res.status(200).json({ success: true });
    }).catch(err => {
        console.log(err);
        res.status(400).json({ success: false });
    });
}


module.exports = { regiser_device, get_device_events, add_device_owner }