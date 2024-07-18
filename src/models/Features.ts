import mongoose, {Schema, Document} from 'mongoose';

export interface Feature extends Document {
    projectId: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    media: string;
}

const featureSchema:Schema<Feature> = new Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        trim: true
    },
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

const FeatureModel = mongoose.models.Feature as mongoose.Model<Feature> || mongoose.model('Feature', featureSchema);
export default FeatureModel;