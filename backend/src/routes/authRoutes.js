import express from "express";
import User from "../models/user.js";
import { generateToken } from "../lib/helpers.js";

const router = express.Router();


router.post("/register", async (req, res) => {
    try {


        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if (username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters" });
        }
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const rendomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`

        const user = await User.create({
            username,
            email,
            password,
            image: rendomAvatar,
        });

        const token = generateToken(user._id);
        await user.save();
        return res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                image: user.image,
                createdAt: user.createdAt
            },
            token
        });

    } catch (error) {
        console.log("Error creating user", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                image: user.image,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error) {
        console.log("Error logging in user", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }

});

export default router;