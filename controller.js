const User = require('./models/userModel');
const Device = require('./models/deviceModel');

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
        console.log("New device %s registered by %s", ownerID, name);
        await User.findByIdAndUpdate(ownerID , { "$push": { devicesList: registeredDevice._id } });
        res.status(201).json({ success: true })
    } catch(err) {
        const errors = errorHandler(err);
        res.status(400).json({ success: false });
    }
}

module.exports =  { index_get, signup_post, user_check, random_test, regiser_device };