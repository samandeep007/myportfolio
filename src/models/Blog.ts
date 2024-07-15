import mongoose, { Schema, Document } from 'mongoose';

// Define the Blog interface
export interface Blog extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    featuredImage: string;
    tags: Array<string>;
    archived: boolean;
}

// Define the Blog schema
export const BlogSchema: Schema<Blog> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel", // Ensure "UserModel" matches the name used in the User schema
        required: true
    },
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
    featuredImage: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        type: String
    }],
    archived: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

// Create and export the Blog model
const BlogModel = mongoose.models.Blog as mongoose.Model<Blog> || mongoose.model<Blog>('Blog', BlogSchema);

export default BlogModel;
