import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from "../models/Users.js"

const router = express.Router()

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if(user){
        return res.json({ message: "User Already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({username , password: hashedPassword});

    await newUser.save();
    res.json({ message: "User Registered successfully!" });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if(!user){
        return res.json({ message: "User doesn't Exist"});
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);

    if(!isPasswordVaild){
        return res.json({ message: "Username or Password is Incorrect! "});
    }

    const token = jwt.sign({id: user._id}, "secret");
    res.json({ token, userID: user._id, verify: "verify" });
});


export {router as userRouter };