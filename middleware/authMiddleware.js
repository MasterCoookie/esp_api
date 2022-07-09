const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
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

module.exports = { requireAuth };