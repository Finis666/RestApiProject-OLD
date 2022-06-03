const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {validateCard, Card, generateBizNumber} = require("../model/card");
const { User } = require("../model/user");

router.get("/:id", auth,async (req, res) =>{
    const card = await Card.findOne({
        _id: req.params.id,
        user_id: req.user._id,
    });

    if(!card) {
        res.status(404).send("The card with that given ID was not found");
        return;
    }
    res.send(card);
});


router.put("/:id", auth, async (req, res) =>{
    const { error } = validateCard(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //process
  let card = await Card.findOneAndUpdate(
    {
        _id: req.params.id,
        user_id: req.user._id,
    },
    req.body
    );
    if(!card) {
        res.status(404).send("The Card with the given ID was not found");
        return;
    }
    card = await Card.findOne(
        {
            _id: req.params.id,
            user_id: req.user._id,
        }
    );
    res.send(card);
})

router.delete("/:id", auth, async(req, res) =>{
    const card = await Card.findOneAndRemove({
        _id: req.params.id,
        user_id: req.user._id
    });
    if(!card) {
        res.status(404).send("The card with the given ID was not found");
        return;
    }
    
    res.send(card);
});

router.post("/", auth, async (req, res) =>{
    //validate user inputs
   const { error } = validateCard(req.body);
   if(error) {
       res.status(400).send(error.details[0].message);
       return;
   }


   // system validation
   //process
const card = new Card({
       ...req.body,
       bizImage: req.body.bizImage ? req.body.bizImage : "https://cdn.pixabay.com/photo/2018/05/27/16/30/melon-3433835_960_720.jpg",
       bizNumber: await generateBizNumber(),
       user_id:  req.user._id
   });
   await card.save();

   res.send(card);
});

//get user cards
router.get("/getUserCards/:userUid", auth, (req, res) =>{
    // userUid
    const userUid = req.params.userUid;
    console.log(userUid)
    Card.find()
        .then((result) => {
           let currentUserCards = result.filter((element) =>{
                return element.user_id == userUid
            })
            res.send(currentUserCards);
        }).catch((err) =>{
            throw err;
        })
    // res.send("yes")
});

module.exports = router;