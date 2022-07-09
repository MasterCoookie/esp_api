const User = require('./models/userModel');

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

module.exports =  { index_get, signup_post, user_check, random_test };