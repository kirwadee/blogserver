import { createCustomError } from "../middleware/createCustomeError.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

// @desc user registration
// @route POST /auth/register
// @access Public
export const signupCtrl = async(req, res, next) => {
    try {
        const {username, email, password} = req.body
         
        //confirm if data is not empty
        if(!username || !email || !password) return next(createCustomError(400, "All fields are required"))

        if(password.length < 6) return next(createCustomError(400, "Password must be 6 characters or more"))
         
       
        //check if the user exists prior to registration
        const existedUser = await User.findOne({email})
        if(existedUser) return next(createCustomError(400, "User already exists"))

       
        // Hash password 
        const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

        //create new user
        const newUser = await User.create({
            username,
            email,
            password:hashedPwd
        })

        //check if the new user was created
        if(newUser){
            res.status(201).json({
                _id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                
            })
        } else {
            return next(createCustomError(400, "Invalid User Data!"))
        }
    } catch (error) {
       next(error) 
    }
}

// @desc Login
// @route POST /auth/login
// @access Public
export const signinCtrl = async(req, res, next) => {
    try {
       const userAccount = await User.findOne({email:req.body.email}) 
       if(!userAccount) return next(createCustomError(404, "User Not Found!"))
       //compare entered password and db password asynchronously
       const isPasswordCorrect = await bcrypt.compare(req.body.password, userAccount.password)
       if(!isPasswordCorrect) return next(createCustomError(400, "Wrong Credentials!"))

       //if everything is okay create access token and send the user as response
       const token = jwt.sign({id:userAccount._id}, process.env.JWT_SECRET, {expiresIn:'7d'})
       const {password, ...otherProps} = userAccount._doc

       res.cookie("access_token", token, {
        httpOnly:true
       }).status(200).json(otherProps)
    } catch (error) {
        next(error)
    }
}

export const googleAuthCtrl = async(req, res, next) => {
    try {
       const user = await User.findOne({email:req.body.email}) 
       if(user){
         //if there is a user create access token and send the user as response
       const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

       res.cookie("access_token", token, {
        httpOnly:true
       }).status(200).json(user._doc)

       } else {
        //if you have never login using google
        const newUser = new User({...req.body, fromGoogle:true})
        const savedUser = await newUser.save()
         //if everything is okay create access token and send the user as response
       const token = jwt.sign({id:savedUser._id}, process.env.JWT_SECRET, {expiresIn:'7d'})

       res.cookie("access_token", token, {
        httpOnly:true
       }).status(200).json(savedUser._doc)
       }
    } catch (error) {
        next(error)
    }
}

export const logoutCtrl = async(req, res, next) => {
    try {
        res.clearCookie("access_token",{
            sameSite:"none",
            secure:true
          }).status(200).json("User has been logged out.")
    } catch (error) {
        next(error)
    }
  };

