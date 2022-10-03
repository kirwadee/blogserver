import { createCustomError } from "./createCustomeError.js"
import jwt from 'jsonwebtoken'



export const protect = async(req, res, next)=>{
   const token = req.cookies.access_token

   if(!token) return next(createCustomError(401, "You are Not Authenticated"))

   //if there is a token verify that user by returning a call back fn of either err or user
   jwt.verify(token, process.env.JWT_SECRET, (err,decodedUserObject) =>{
       if(err) return next(createCustomError(403, "Token Not Valid"))
       req.user = decodedUserObject

       next()
   })

}