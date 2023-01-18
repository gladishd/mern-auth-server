const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
router.post("/", async (req, res) => {
    console.log("Reach the POST route on Mern-Auth")
    try {
        const { email, password, passwordVerify } = req.body;

        console.log("The req body is ", req.body, email, password, passwordVerify)

        //validation
        if (!email || !password || !passwordVerify)
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });

        if (password.length < 6)
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 6 characters."
                });

        if (password !== passwordVerify)
            return res
                .status(400)
                .json({
                    errorMessage: "Please make sure the passwords match."
                });
        console.log("test code")
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res
                .status(400)
                .json({
                    errorMessage: "An account with this email already exists."
                });

        //hash pswrd
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("the salt is ", salt, passwordHash)
        // save a new user account to the database
        const newUser = new User({
            email, passwordHash
        });

        console.log("The new user is ", newUser)

        const savedUser = await newUser.save();

        //sign the token
        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET);

        //send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        }).send();

        console.log('did we reach this code')

    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

router.post("/login", async (req, res) => {
    console.log("Reach the login route")
    try {
        const { email, password } = req.body;
        console.log("the req.body on login is ", req.body)

        //validate
        if (!email || !password)
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });

        const existingUser = await User.findOne({ email });
        console.log("let's see if it finds the existing user. ", existingUser)
        if (!existingUser)
            return res
                .status(401)
                .json({ errorMessage: "The email or password is incorrect." });

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect)
            return res
                .status(401)
                .json({ errorMessage: "The email or password is incorrect." });

        //sign the token
        const token = jwt.sign({
            user: existingUser._id
        }, process.env.JWT_SECRET);

        //send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        }).send();


    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

router.get("/logout", (req, res) => {
    res
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        })
        .send();
});

router.get("/loggedIn", (req, res) => {
    try {
        console.log("it's a cookie!")
        const token = req.cookies.token;
        if (!token) return res.json(false);

        jwt.verify(token, process.env.JWT_SECRET);

        res.send(true);
    } catch (error) {
        console.error(error);
        res.json(false);
    }
});




module.exports = router;
