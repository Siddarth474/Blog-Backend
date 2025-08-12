import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum : ['published', 'draft'],
            default: 'published'
        },
        tags: [
            {
                type: String,
                lowercase: true,
                trim: true 
            }
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref : 'Comment'
            }
        ]
    }
    ,{timestamps : true}
);

export const Blog = mongoose.model('Blog', blogSchema);