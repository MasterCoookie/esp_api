const User = require('../models/userModel');
const Device = require('../models/deviceModel');
const DeviceEvent = require('../models/deviceEventModel');

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
        return next_occurance;
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
        console.log(err);
    });
    if(event[0]) {
        console.log(event[0]);
        await Device.findByIdAndUpdate(deviceID, { pendingEventID: event[0]._id });
        res.status(200).json({ event: event[0] });
        
    } else {
        res.status(204).json({ event: null });
        console.log("Not found ");
    }
    
}

const confirm_event_done = async (req, res) => {
    const { eventID } = req.body;

    let event = await DeviceEvent.findById(eventID).catch(err => {
        console.log(err);
    });
    if(event.repeatable) {
        const event_next_occurance = caclulate_next_occurance(event);
        const hours = event.eventTime.getHours();
        const minutes = event.eventTime.getMinutes();

        event.eventTime = event_next_occurance.valueOf();
        event.eventTime.setHours(hours, minutes, 0);
        await event.save();
    } else {
        event.delete();
    }
}

module.exports =  { index_get,
    signup_post,
    user_check, 
    random_test,
    create_event,
    delete_event,
    update_event,
    check_pending_event,
    confirm_event_done
};