const express = require("express");
const bcrypt = require("bcrypt")
const _ = require("lodash");
const router = express.Router();
const { validateUser, User } = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) =>{
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post("/", async (req, res) =>{
    const {error} = validateUser(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    let user = await User.findOne({email: req.body.email});
    if(user) {
        res.status(400).send("User already exists");
        return;
    }

    user = new User(req.body);
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt)
    await user.save();
    res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;