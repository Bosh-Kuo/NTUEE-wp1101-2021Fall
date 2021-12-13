import bcrypt from "bcrypt";
import User from "../models/User";
import { Router } from "express";

const router = Router();

//REGISTER
router.post("/register", async (req, res) => {
    try {
        // check user
        const existUser = await User.findOne({ username: req.body.username });

        if (!existUser) {
            //generate new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);


            //create new user
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
            });

            //save user and respond
            // console.log(newUser)
            const user = await newUser.save();
            res.status(200).json({ type: "success", msg: `User: ${req.body.username} successfully established !` });
        } else {
            res.status(200).json({ type: "exist", msg: `Username: ${req.body.username} has already existed!` });
        }
    } catch (err) {
        console.log(err)
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(200).json({ type: "error", msg: "user not found" });
        } else{
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword){
                res.status(200).json({ type: "error", msg: "wrong password" });
            } else {
                res.status(200).json({ type: "success", msg: "Successfully Login" })
            }
        }
    } catch (err) {
        console.log(err)
    }
});

export default router
