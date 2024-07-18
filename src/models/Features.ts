import mongoose, {Schema, Document} from 'mongoose';

export interface Feature extends Document {
    title: string;
    description: string;
    media: string;
}

const featureSchema:Schema<Feature> = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    media: {
        type: String,
        required: true,
        trim: true
    }
});