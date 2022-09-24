import { createCustomError } from "./createCustomeError.js"
import jwt from 'jsonwebtoken'
import User from "../models/User.js"



export const protect = async(req, res, next)=>{
 const authHeaders = req.headers.authorization || req.headers.authorization
 
 if(!authHeaders) return next(400, "No request headers")
 
 if(authHeaders.startsWith('Bearer ')){
    const token = authHeaders.split(' ')[1]
    if(!token) return next(createCustomError(400, "No token attached"))

    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
        if(err) return next(createCustomError(401, "Token Not Valid"))
   
        console.log(decoded)
        console.log("===============")

        const loggedInUser = await User.findById(decoded.id).select("-password")
        console.log(loggedInUser)
        console.log("===============")
        req.userId = loggedInUser?._id
        req.isAdmin = loggedInUser?.isAdmin
        console.log(req.userId)
        console.log(req.isAdmin)

        req.user = decoded

        next()
    })
 } else {
    return next(createCustomError(400, "No token"))
 }

}