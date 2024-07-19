import mongoose, {Schema, Document} from 'mongoose';

export interface IExperience extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    companyName: string;
    companyLocation: string;
    companyLogo: string;
    jobType: string;
    jobRole: string;
    roleDescription: string;
    startDate: Date;
    endDate: Date;
}

const ExperienceSchema: Schema<IExperience> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },

    companyName: {
        type: String,
        required: true,
        trim: true
    },

    companyLocation: {
        type: String,
        required: true,
        trim: true
    },

    companyLogo: {
        type: String,
        required: true,
        trim: true
    },

    jobType: {
        type: String,
        required: true,
        trim: true
    },

    jobRole: {
        type: String,
        required: true,
        trim: true
    },

    roleDescription: {
        type: String,
        required: true,
        trim: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: Date

}, {timestamps: true})

const ExperienceModel = mongoose.models.Experience as mongoose.Model<IExperience> || mongoose.model('Experience', ExperienceSchema);
export default ExperienceModel;
