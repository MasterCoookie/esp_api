const User = require('../models/userModel');

//TODO: protect devices (potentially)

const require_auth = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if(await User.check_user(email, password)) {
            next();
        } else {
            res.status(403).json({ error: 'Invalid username or password' });
        }
    } catch(err) {
        res.status(400).json({ err });
    }
}


module.exports = { require_auth };