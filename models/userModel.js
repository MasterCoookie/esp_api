const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        validate: [isEmail, "Please enter correct email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [24, "Password cannot be more than 24 characters long"],
    },
    devicesList: [Schema.Types.ObjectId],
});

userSchema.pre('save', function(next) {
    const hash = bcrypt.hashSync(this.password, 10);
    this.password = hash;
    next();
});

userSchema.statics.check_user = async function(email, password) {
    const user = await this.findOne({ email });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
    }
    return false;
};

const User = mongoose.model('user', userSchema);

module.exports = User;