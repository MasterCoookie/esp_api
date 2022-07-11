const User = require('./models/userModel');
const Device = require('./models/deviceModel');
const DeviceEvent = require('./models/deviceEventModel');

const index_get =  (req, res) => {
    console.log("New request");
    res.render('index');
};

const errorHandler = (err) => {
    let errors = { email: '', password: ''}

    if(err.code === 11000) {
        errors.email = "Email already in use";
        return errors;
    }
}

const signup_post = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        res.status(201).json({ success: true });
    } catch(err) {
        const errors = errorHandler(err);
        console.log(err);
        res.status(400).json(errors);
    }
}

const user_check = async (req, res) => {
    const { email, password } = req.body;

    try {
        if(await User.check_user(email, password)) {
            res.status(200).json({ success: true });
        } else {
            res.status(403).json({ success: false})
        }
    } catch(err) {
        const errors = errorHandler(err);
        res.status(400).json({ errors });
    }
}

const random_test = (req, res) => {
    res.status(200).json({ dupa: "dupa" });
}

const regiser_device = async (req, res) => {
    const { ownerID, name } = req.body;
    
    try {
        const registeredDevice = await Device.create({ owners: [ownerID] ,name });
        console.log("New device %s registered by %s", name, ownerID);
        await User.findByIdAndUpdate(ownerID , { "$push": { devicesList: registeredDevice._id } });
        res.status(201).json({ success: true })
    } catch(err) {
        //const errors = errorHandler(err);
        console.log(err);
        res.status(400).json({ success: false });
    }
}

const create_event = async (req, res) => {
    const { deviceID, eventTime, targetYpos, repeatable, repeat } = req.body;
    const eventTimeDate = new Date(eventTime * 1000);

    try {
        await DeviceEvent.create({ deviceID, eventTime: eventTimeDate, targetYpos, repeatable, repeat });
        res.status(201).json({ success: true });
    } catch(err) {
        console.log(err);
        res.status(400).json({ success: false });
    }
}

const update_event = async (req, res) => {
    const { eventID, eventTime, targetYpos, repeatable, repeat } = req.body;
    const eventTimeDate = new Date(eventTime * 1000);

    try {
        await DeviceEvent.findByIdAndUpdate(eventID, {
            eventTime: eventTimeDate,
            targetYpos, repeatable, repeat
        });
        res.status(200).json({ success: true });
    } catch(err) {
        console.log(err);
        res.status(400).json({ success: false });
    }
}

const delete_event = async (req, res) => {
    const { eventID } = req.body;

    try {
        await DeviceEvent.findByIdAndDelete(eventID);
        res.status(200).json({ success: true });
    } catch(err) {
        console.log(err);
        res.status(400).json({ success: false });
    }
}

const get_device_events = async (req, res) => {
    const { deviceID } = req.body;

    DeviceEvent.find({ deviceID }).then( result => {
        res.status(200).json({ events: result });
    }).catch(err => {
        console.log(err);
    });
}

const check_pending_event = async (req, res) => {
    const { deviceID } = req.body;

    //TODO : calculate time for nearing event,
    //TODO: query by calculated time
    DeviceEvent.find({ deviceID,  }).then( result => {
        //TODO: add found event to pendingEventID field in device and return event
        res.status(200).json({ events: result });
    }).catch(err => {
        console.log(err);
    });
}

module.exports =  { index_get,
    signup_post,
    user_check, 
    random_test,
    regiser_device, 
    create_event,
    delete_event,
    update_event,
    get_device_events,
    check_pending_event
};