import express from 'express'
import { deleteUserCtrl, dislikePostCtrl, getAllUsers, getUserProfileCtrl, likePostCtrl, updateUserCtrl } from '../controllers/user-controller.js'
import { protect } from '../middleware/authMiddleware.js'


const userRouter = express.Router()

userRouter.get("/profile/:id",  getUserProfileCtrl)
userRouter.get("/", protect, getAllUsers)
userRouter.delete("/:id", protect, deleteUserCtrl)
userRouter.put("/:id", protect, updateUserCtrl)
userRouter.put("/like/:postId", protect, likePostCtrl)
userRouter.put("/dislike/:postId", protect, dislikePostCtrl)



export default userRouter