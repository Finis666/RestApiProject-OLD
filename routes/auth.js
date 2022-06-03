const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../model/user");
const router = express.Router();

router.post("/", async(req, res) =>{
    // validate user inputs
    const { error } = validate(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //validate system
    let user = await User.findOne({ email:req.body.email });
    if(!user) {
        req.status(400).send("Invalid email or password");
        return;
    }
    const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if(!isValidPassword){
        res.status(400).send("Invalid email or password");
        return;
    }

    // process
    const token = user.generateAuthToken();
    
    // response ok
    user.generateAuthToken();
    res.send({
        token,
    });
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(1024).required(),
    });
    return schema.validate(user);
}

module.exports = router;