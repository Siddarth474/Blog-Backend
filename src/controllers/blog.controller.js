import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBlog = async (req, res) => {
    const {title, content, status, tags} = req.body;

    if(!title || !content) {
        throw new ApiError(400, "Title & Content can't be empty");
    }

    const authorId = req.user?._id;
    if(!authorId) throw new ApiError(401, "Unauthorized: User not logged in");

    const blog = await Blog.create({
        title,
        content,
        status,
        tags,
        author: authorId,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog created successfully"));
}

const getBlogById = async (req, res) => {
    const {blogId} = req.params;
    const blog = await Blog.findById(blogId).populate('comments');

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog fetched successfully"));
}

const updateBlog = async (req, res) => {
    const {blogId} = req.params;
    const updates = req.body;

    if(!mongoose.isValidObjectId(blogId)) {
        throw new ApiError(404, "Invalid Blog ID");
    }
    
    if(!updates) throw new ApiError(400, "Field cannot be empty");

    const blog = await Blog.findOneAndUpdate(
        {_id: blogId, author: req.user?._id},
        updates,
        {new: true, runValidators: true}
    );

    if(!blog) throw new ApiError(404, "Blog not found");
    
    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog updated successfully"));
}

const deleteBlog = async (req, res) => {
    const {blogId} = req.params;

    const blog = await Blog.findOneAndDelete({_id: blogId, author: req.user?._id});

    if(!blog) throw new ApiError(404, "Blog not found");
    
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Blog deleted successfully"));
}

const getAllBlogs = async (req, res) => {
    const userId = req.user?._id;

    if(!userId) {
        if(!userId) throw new ApiError(401, "Unauthorized: User not logged in");
    }

    const blogs = await Blog.find();

    if(!blogs) {
        throw new ApiError(404, "Blogs not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, blogs, "All Blogs fetched successfully"));
}

export {
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog,
    getAllBlogs
}