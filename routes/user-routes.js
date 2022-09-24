import express from 'express'
import { deleteUserCtrl, getAllUsers, getUserProfileCtrl, updateUserCtrl } from '../controllers/user-controller.js'
import { protect } from '../middleware/authMiddleware.js'


const userRouter = express.Router()

userRouter.get("/profile", protect,  getUserProfileCtrl)
userRouter.get("/", protect, getAllUsers)
userRouter.delete("/:id", protect, deleteUserCtrl)
userRouter.put("/:id", protect, updateUserCtrl)



export default userRouter