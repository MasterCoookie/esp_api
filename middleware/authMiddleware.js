const User = require('../models/userModel');
const Device = require('../models/deviceModel');

//TODO: protect devices (potentially)

const require_auth = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.check_user(email, password);
        if(user) {
            res.locals.user = user;
            next();
        } else {
            res.status(403).json({ error: 'Invalid username or password' });
        }
    } catch(err) {
        res.status(400).json({ err });
    }
}

const check_device_ownership = async (req, res, next) => {
    const { deviceID } = req.body;
    const userID = res.locals.user._id;
    try {
        if(await Device.findOne({ _id: deviceID, owners: userID })) {
            next();
        } else {
            res.status(403).json({ err: 'Device acces denied' });
        }
    } catch(err) {
        console.log(err);
        res.status(400).json({ err });
    }
}


module.exports = { require_auth, check_device_ownership };