import { createCustomError } from "../middleware/createCustomeError.js"
import Post from "../models/Post.js"
import User from "../models/User.js"

// @desc add post by user or admin
// @route POST /api/posts
// @access Private
export const addPostCtrl = async(req, res, next) => {
  if(req.userId && req.isAdmin){
    const newPost = new Post({ postCreatorId:req.userId, ...req.body })
    try {
        const savedPost = await newPost.save()
        if(!savedPost) return next(createCustomError(400, "Failed to save data"))
        res.status(200).json(savedPost)
    } catch (error) {
      next(error)  
    }
  }
}

// @desc update post by user or admin
// @route PUT /api/posts/:id
// @access Private
export const updatePostCtrl = async(req, res, next) => {
    try {
        //find the post to be updated in db
        const post = await Post.findById(req.params.id)
        
        if(!post) return next(createCustomError(404, "Post Not Found"))

        //verify if you are the owner of the post u want to dlete
       if(req.user.id === post.postCreatorId || req.isAdmin){
         await Post.findByIdAndUpdate(
            req.params.id, 
            {$set:req.body},
            { new:true })
         res.status(200).json(post)
       } else {
        return next(createCustomError(403, "You can only update your post"))
       }
    } catch (error) {
        next(error)
    }
}

// @desc delete post by user or admin
// @route DELETE /api/posts/:id
// @access Private
export const deletePostCtrl = async(req, res, next) => {
    try {
        //find the post to be deleted in db
        const post = await Post.findById(req.params.id)
        
        if(!post) return next(createCustomError(404, "Post Not Found"))

        //verify if you are the owner of the post u want to dlete
       if(req.user.id === post.postCreatorId || req.isAdmin){
         await Post.findByIdAndDelete(req.params.id)
         res.status(200).json("The post has been deleted")
       } else {
        return next(createCustomError(403, "You can only delete your post"))
       }
    } catch (error) {
        next(error)
    }

}

// @desc get all posts
// @route DELETE /api/posts/:id
// @access Private
export const getAllPostsCtrl = async(req, res, next) => {
    try {
       const posts = await Post.find({}).select("-password") 
       if(!posts.length) return next(createCustomError(404, "Posts Not Found!"))
       res.status(200).json(posts)
    } catch (error) {
        next(error)
    }
}

//increment views by 1 in any post watched or visited or opened
export const addViewsCtrl = async(req, res, next) => {
    try {
       await Post.findByIdAndUpdate(
        req.params.id,
        { $inc:{ views: 1 }}
        ) 
        res.status(200).json("The view has been increased")
    } catch (error) {
        next(error)  
    }
}

//get random posts
export const getRandomPostsCtrl = async(req, res, next) => {
    try {
       const randomPosts = await Post.aggregate([ { $sample: { size: 40 } } ])
       res.status(200).json(randomPosts)
    } catch (error) {
      next(error) 
    }
}

//get trending posts ie post with most views to the least views
export const getTrendingPosts = async(req, res, next) => {
    try {
        const trendingPosts = await Post.find().sort({ views: -1})
        res.status(200).json(trendingPosts)
    } catch (error) {
        next(error)
    }
}

//get posts from subscibedTo channels ids
export const getSubcribedPostsCtrl = async(req, res, next) => {
    try {
        //find the user
        const user = await User.findById(req.user.id)
        //get that particular user  usersSubscribedTo array
        const subscribedChannelsArrayOfIds = user.usersSubscribedTo
         
        //find the posts list
        const list = await Promise.all(
            subscribedChannelsArrayOfIds.map((channelId) => {
                return Post.find({ userId: channelId})
            })
        );
         
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - b.createdAt))
    } catch (error) {
        next(error)
    }
}


//search posts by categories field which is an array || use $in filter
export const searchPostsByCategoriesCtrl = async(req, res, next) => {
const catsSearched = req.query.categories.split(",")
try {
    //query in all post categories field array and find the matching catsSearched
    const foundCats = await Post.find({ categories: { $in: catsSearched} }).limit(40)
    res.status(200).json(foundCats)
} catch (error) {
    next(error)
}
}

//search posts by its title field which is a string || use $regex filter
export const searchPostsByItsTitleCtrl = async(req, res, next) => {
    const queryString = req.query.searchedWord
    
    try {
        const matchedString = await Post.find({ title: { $regex: queryString, $options:"i" }})
        res.status(200).json(matchedString)
    } catch (error) {
        next(error)
    }
}
