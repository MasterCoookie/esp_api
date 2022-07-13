const User = require('./models/userModel');
const Device = require('./models/deviceModel');
const DeviceEvent = require('./models/deviceEventModel');

const caclulate_next_occurance = event => {
        const curr_time = new Date(Date.now());
        const next_occurance = new Date();
        next_occurance.setDate(event.eventTime.getDate() + 1);
        let weekday = curr_time.getDay() + 1;
        while(!event.repeat[weekday]) {
            next_occurance.setDate(next_occurance.getDate() + 1);
            if(++weekday > 6) {
                weekday = 0;
            }
        }
        console.log(next_occurance);
}

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

    DeviceEvent.find({ deviceID }).then(result => {
        res.status(200).json({ events: result });
    }).catch(err => {
        console.log(err);
    });
}

const check_pending_event = async (req, res) => {
    const { deviceID } = req.body;
    const curr_time = Date.now();

    const time_limit = new Date(curr_time + 300000);
    //console.log(curr_time, time_limit);
    //TODO: more complex check, allowing event repetition
    //IDEA: keep this way of quering, but in different field (sth like nex occurance)
    //this would be calculated after quering
    const event = await DeviceEvent.find({ deviceID,
        eventTime : { $gt: curr_time, $lt: time_limit }
    }).catch(err => {
        console.log(err);
    });
    if(event[0]) {
        console.log(event[0]);
        await Device.findByIdAndUpdate(deviceID, { pendingEventID: event[0]._id });
        res.status(200).json({ event: event[0] });
        
        //TODO: move call to controller that runs after event occured
        console.log(caclulate_next_occurance(event[0]));
    } else {
        res.status(204).json({ event: null });
        console.log("Not found ");
    }
    
}

const confirm_event_done = async (req, res) => {
    const { eventID } = req.body;

    await DeviceEvent.findById(eventID).then(resultEvent => {
        if(resultEvent.repeatable) {
            caclulate_next_occurance(resultEvent);
        }
    }).catch(err => {
        console.log(err);
    })
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
    check_pending_event,
    confirm_event_done
};