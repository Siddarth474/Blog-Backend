import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addComment = async (req, res) => {
    const {id} = req.params;
    const {content} = req.body;

    if(!content) {
        throw new ApiError(400, "Comment is empty or Invalid!!");
    }

    const userID = req.user?._id;
    if(!userID) throw new ApiError(401, "Unauthorized! User not logged in");

    const comment = await Comment.create({
        content,
        blog: id,
        owner: userID
    });

    const blog = await Blog.findById(id);
    if (!blog) {
       throw new ApiError(404, "Blog not found");
    }

    blog.comments.push(comment._id);
    await blog.save();

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment added successfully!"));
}

const getCommentById = async (req, res) => {
    const {commentId} = req.params;

    const comment = await Comment.findById(commentId).populate('blog');

    if(!comment) throw new ApiError(404, "Comment not found");

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment fetched successfully!")); 
}

const updateComment = async (req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;

    if(!content) throw new ApiError(400, "Field is empty!");

    const comment = await Comment.findOneAndUpdate(
        {_id: commentId,owner: req.user?._id},
        {content},
        {new: true, runValidators: true}
    );

    if(!comment) throw new ApiError(404, "Comment not found");

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully!")); 
}

const deleteComment = async (req, res) => {
    const {commentId} = req.params;

    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user?._id
    });
    
    if(!comment) throw new ApiError(404, "Comment not found");

    await Blog.findByIdAndUpdate(comment.blog, {
        $pull: { comments: comment._id }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully!")); 
}

const getAllComments = async (req, res) => {
    const userId = req.user?._id;
    if(!userId) {
        throw new ApiError(401, "Unauthorized : User not logged in");
    }

    const comments = await Comment.find();
    if(!comments) throw new ApiError(404, "Comments not found");

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "All Comments fetched successfully!")); 
}

export {
    addComment,
    getCommentById,
    updateComment,
    deleteComment,
    getAllComments
}