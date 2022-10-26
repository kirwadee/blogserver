import { createCustomError } from "../middleware/createCustomeError.js";
import Post from "../models/Post.js";

// @desc add post by user or admin
// @route POST /api/posts
// @access Private
export const addPostCtrl = async (req, res, next) => {
  const newPost = new Post({ userId: req.user.id, ...req.body });
  try {
    const savedPost = await newPost.save();
    if (!savedPost) return next(createCustomError(400, "Failed to save data"));
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// @desc update post by user or admin
// @route PUT /api/posts/:id
// @access Private
export const updatePostCtrl = async (req, res, next) => {
  try {
    //find the post to be updated in db
    const post = await Post.findById(req.params.id);

    if (!post) return next(createCustomError(404, "Post Not Found"));

    //verify if you are the owner of the post u want to dlete
    if (req.user.id === post.userId) {
      await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(post);
    } else {
      return next(createCustomError(403, "You can only update your post"));
    }
  } catch (error) {
    next(error);
  }
};

// @desc delete post by user or admin
// @route DELETE /api/posts/:id
// @access Private
export const deletePostCtrl = async (req, res, next) => {
  try {
    //find the post to be deleted in db
    const post = await Post.findById(req.params.id);

    if (!post) return next(createCustomError(404, "Post Not Found"));

    //verify if you are the owner of the post u want to dlete
    if (req.user.id === post.userId) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("The post has been deleted");
    } else {
      return next(createCustomError(403, "You can only delete your post"));
    }
  } catch (error) {
    next(error);
  }
};

// @desc get all posts
// @route GET /api/posts
// @access Public
export const getAllPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    if (!posts.length) return next(createCustomError(404, "Posts Not Found!"));
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// export const getSearchedPostsCtrl = async (req, res, next) => {
//   const { q } = req.query;

//   try {
//     const title = new RegExp(q, "i");
//     const posts = await Post.find({ title });

//     // if (!posts.length) return next(createCustomError(404, "Posts Not Found!"));

//     res.status(200).json(posts);
//   } catch (error) {
//     next(error);
//   }
// };

// @desc get a single post
// @route GET /api/posts/:id
// @access Public
export const getSinglePostCtrl = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createCustomError(404, "Post Not Found!"));
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

//get random posts
export const getRandomPostsCtrl = async (req, res, next) => {
  try {
    const randomPosts = await Post.aggregate([{ $sample: { size: 2 } }]);
    res.status(200).json(randomPosts);
  } catch (error) {
    next(error);
  }
};

//search posts by cat field
export const searchPostsByCategoriesCtrl = async (req, res, next) => {
  //cat field in post model ie science, art is the searched word
  const catSearched = req.query.cat;
  try {
    //query in all post categories field  and find the matching catsSearched
    const foundCats = await Post.find({ cat: catSearched }).limit(40);
    if (!foundCats.length)
      return next(createCustomError(404, "No Recommended Posts Found!"));
    res.status(200).json(foundCats);
  } catch (error) {
    next(error);
  }
};

//search posts by its title field which is a string || use $regex filter
export const searchPostsByTitleCtrl = async (req, res, next) => {
  const query = req.query.q;
  try {
    const posts = await Post.find({
      title: { $regex: query, $options: "i" },
    }).limit(10);

    if (!posts.length) return next(createCustomError(404, "Posts Not Found!"));
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
