import express from "express";
import User from "../models/User.js"; // import User model
import jwt from "jsonwebtoken"; // import token

const router = express.Router(); //1. create router with express

const generateToken = (userId) => { // create token
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "30d"}); // expires in 15 days
}

router.post("/register", async (req, res) => { // sign up
    try {
        const{email, username, password} = req.body;

        if(!email || !username || !password) { // if not filled up
            return res.status(400).json({ message: "All fields are required" }); // error code: 400 with json msg
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" }); // pw <6
        }

        if(username.length < 3) {
            return res.status(400).json({ message: "Username should be at least 3 characters long" }); // username <3
        }

        // check if user already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // get a random avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const user = new User({ // create user if don't exists
            email,
            username,
            password,
            profileImage, // same as profileImage: profileImage
        })

        await user.save();

        const token = generateToken(user._id); // generate JWT(token) or create token

        res.status(201).json({ // respond created in backend => send token and user
            token,
            user: { // user information, dont show password
                id: user._id, // this is how mongoDB stores the info
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
        })
    } catch (error) { // error message
        console.log("Error in register route", error);
        res.status(500).json({ message: "Internal server error"});
    }
});

router.post("/login", async (req, res) => { // login
    try{
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        // check if user already exists
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "Invalid credentials" });

        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password); // return true/false
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id); // generate JWT(token) or create token

        res.status(201).json({ // respond created in backend => send token and user
            token,
            user: { // user information, dont show password
                id: user._id, // this is how mongoDB stores the info
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
        })
    } catch (error) {
        console.log("Error in login route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router; //2.