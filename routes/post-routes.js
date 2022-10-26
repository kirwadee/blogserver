import express from "express";
import {
  addPostCtrl,
  deletePostCtrl,
  getAllPostsCtrl,
  getRandomPostsCtrl,
  getSinglePostCtrl,
  searchPostsByCategoriesCtrl,
  searchPostsByTitleCtrl,
  updatePostCtrl,
} from "../controllers/post-controller.js";
import { protect } from "../middleware/authMiddleware.js";

const postRouter = express.Router();

postRouter.get("/random", getRandomPostsCtrl);
postRouter.get("/find", searchPostsByTitleCtrl);
postRouter.get("/cat", searchPostsByCategoriesCtrl);

postRouter.post("/", protect, addPostCtrl);
postRouter.put("/:id", protect, updatePostCtrl);
postRouter.delete("/:id", protect, deletePostCtrl);
postRouter.get("/", getAllPostsCtrl);
postRouter.get("/:id", getSinglePostCtrl);

export default postRouter;
