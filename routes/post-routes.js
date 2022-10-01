import express from 'express'
import { 
    addPostCtrl, deletePostCtrl, getAllPostsCtrl,
     getRandomPostsCtrl,getSinglePostCtrl,getTrendingPosts, searchPostsByCategoriesCtrl,
      searchPostsByItsTitleCtrl, updatePostCtrl } from '../controllers/post-controller.js'
import { protect } from '../middleware/authMiddleware.js'


const postRouter = express.Router()

postRouter.post("/", protect, addPostCtrl)
postRouter.put("/:id", protect, updatePostCtrl)
postRouter.delete("/:id", protect, deletePostCtrl)
postRouter.get("/", getAllPostsCtrl)
postRouter.get("/:id", getSinglePostCtrl)
postRouter.get("/trending", getTrendingPosts)
postRouter.get("/random", getRandomPostsCtrl)
postRouter.get("/search", searchPostsByItsTitleCtrl)
postRouter.get("/cat", searchPostsByCategoriesCtrl)


export default postRouter