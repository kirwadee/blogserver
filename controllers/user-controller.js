import { createCustomError } from "../middleware/createCustomeError.js"
import User from "../models/User.js"


// @desc get your profile wnen logged in
// @route GET /api/users/profile
// @access Private
export const getUserProfileCtrl = async(req, res, next)=>{
    try {
        const user = await User.findById(req.userId)
        if(!user) return next(createCustomError(404, "No user found!"))

        res.status(200).json(user)

    } catch (error) {
       next(error) 
    }
}


// @desc get all users by admin only
// @route GET /api/users
// @access Private
export const getAllUsers = async(req, res, next)=>{
    
        if(req.userId && req.isAdmin){
            try {
                const users = await User.find({})

                if(!users.length) return next(createCustomError(404, "No Users Found"))
                res.json(users)

            } catch (error) {
                next(error)
            }

        } else {
            return next(createCustomError(403, "Forbidden Access"))
        }
    
}

// @desc delete user by user and admin 
// @route DELETE /api/users/:Id
// @access Private
export const deleteUserCtrl = async(req, res, next) => {
        if(req.params.id === req.userId || req.isAdmin){
          try {
            const user = await User.findByIdAndDelete(req.params.id)

            if(!user) return next(createCustomError(400, "No User Record"))

            res.status(200).json(`User ${user.username} with ID: ${user._id} has been deleted`)
          } catch (error) {
            next(error)
          }

        } else {
            return next(createCustomError(403, "You can only delete your account"))
        }
    
}

// @desc update user by user and admin 
// @route UPDATE /api/users/:Id
// @access Private
export const updateUserCtrl = async(req, res, next) => {
    if(req.params.id === req.user.id || req.isAdmin){
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id, 
                {
                    $set:req.body
                },
                { new:true }
                )

                if(!updatedUser){
                    return next(createCustomError(400, "No User Found"))
                }
                
            res.status(200).json(updatedUser)

        } catch (error) {
           next(error) 
        }
    }else{
        return next(createCustomError(403, "You can only update your account"))
    }
    }