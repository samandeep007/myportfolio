import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    senderName: string
    senderEmail: string;
    subject: string;
    content: string;
    reply: string;
    createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    senderEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    senderName: {
        type: String,
        required: true,
        trim: true
    },

    subject: {
        type: String,
        trim: true,
        required: [true, "Subject is required"]
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    reply: {
        type: String,
        required: true,
        trim: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})


export interface User extends Document {
    username: string;
    fullName: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    messages: Message[]
}

export const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        lowercase: true,
        unique: true
    },

    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 'please use a valid email address']
    },

    password: {
        type: String,
        required: [true, "password is required"]
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verifyCode: {
        type: String,
        required: [true, 'verify code is required']
    },

    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"]
    },

    messages: [MessageSchema]
}, { timestamps: true });

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);

export default UserModel;
