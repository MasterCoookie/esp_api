const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: [isEmail, "Please enter correct email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
        minlength: [24, "Password cannot be more than 24 characters long"],
    },
    devicesList: [Schema.Types.ObjectId],
    default: undefined
});

userSchema.pre('save', (next) => {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

const User = mongoose.model('user', userSchema);