const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const cardScheme = new mongoose.Schema({
    bizName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
    },
    bizDescription: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024,
    },
    bizAddress: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 400,
    },
    bizPhone: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10,
    },
    bizImage: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 1024,
    },
    bizNumber: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        unique: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
});


const Card = mongoose.model("Card", cardScheme, "cards");

//  Validating card

function validateCard(card){
    const scheme = Joi.object({
        bizName: Joi.string().min(2).max(255).required(),
        bizDescription: Joi.string().min(2).max(1024).required(),
        bizAddress: Joi.string().min(2).max(400).required(),
        bizPhone: Joi.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/),
        bizImage: Joi.string().min(11).max(1024),
    });
    return scheme.validate(card)
};

async function generateBizNumber(){
    while(true) {
        let randomNumber = _.random(1000, 999_999_999_999);
        const card = await Card.findOne({bizNumber: randomNumber});
        if(!card) {
            return String(randomNumber);
        }
    }
}

module.exports = {
    validateCard,
    Card,
    generateBizNumber,
}