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

        //create user
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
       if(!userAccount) return next(createCustomError(400, "You don't have an account, Kindly create one"))

       //compare entered password and db password asynchronously
       const isMatch = await bcrypt.compare(req.body.password, userAccount.password)
       if(!isMatch) return next(createCustomError(400, "Wrong Credentials!"))  
       
     if(userAccount && isMatch){
        res.status(200).json({
            _id:userAccount._id,
            username: userAccount.username,
            email:userAccount.email,
            token:generateToken(userAccount._id)
        })
     } else {
        return next(createCustomError(400, "Invalid Credentials!"))
     }
    

    } catch (error) {
        next(error)
    }
}

//generate JWT token utility function
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:'10d'
    })
}