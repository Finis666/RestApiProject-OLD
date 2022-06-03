const jwt = require("jsonwebtoken");
const config = require("config");
function auth(req, res, next) {
 
    const token = req.header("x-auth-token");
    if(!token) {
        res.status(401).send("Access denied. No Token provided");
        return;
    }
    try{
        const decoded = jwt.verify(token, config.get("jwtKey"));
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send("Invalid token.");
    }
}

module.exports = auth;