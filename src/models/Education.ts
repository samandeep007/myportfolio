import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
    userId: string;
    school: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date;
    grade: Number;
    activities: string;
    description: string;
    skills: Array<String>;
    media: string;
}

const EducationSchema: Schema<IEducation> = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },

    school: {
        type: String,
        required: true,
        trim: true
    },
    degree: {
        type: String,
        required: true,
        trim: true
    },
    field: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    activities: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    skills: {
        type: [String],
        required: true,
        default: []
    },
    media: {
        type: String,
        trim: true
    }
}, { timestamps: true });


const EducationModel = mongoose.models.Education as mongoose.Model<IEducation> || mongoose.model('Education', EducationSchema);
export default EducationModel;