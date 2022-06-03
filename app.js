const express = require("express");
const mongoose = require("mongoose");
require("./model/user");
mongoose.connect("mongodb://localhost/HackerYouProject")
    .then(() =>{
        console.log("Connected to MongoDB")
    }).catch(()=>{
        console.log("Couldn't connect to mongoDB");
    })

const app = express();

const morgan = require("morgan");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardsRouter = require("./routes/cards");

// Apply middleware
app.use(morgan("dev"));
app.use(express.json());

// routing
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);

const PORT = 3000;

app.listen(PORT, console.log(`Listening on port ${PORT}`));
