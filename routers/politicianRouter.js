const router = require("express").Router();
const Politician = require("../models/politicianModel");
const auth = require('../middleware/auth');

router.post("/", auth, async (req, res) => {
    try {
        const {name} = req.body;

        const newPolitician = new Politician({
            name
        });

        const savedPolitician = await newPolitician.save();

        res.json(savedPolitician);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const politicians = await Politician.find();
        res.json(politicians);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

module.exports = router;