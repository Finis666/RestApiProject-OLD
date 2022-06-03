const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config")
let userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
    biz: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

userScheme.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, biz: this.biz}, config.get("jwtKey"));
};

const User = mongoose.model("User", userScheme, 'users');

function validateUser(user){
    const scheme = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(1024).required(),
        biz: Joi.boolean().required(),
    });
    return scheme.validate(user)
};

module.exports = {
    User,
    validateUser,
};
