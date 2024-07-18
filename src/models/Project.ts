import mongoose, {Schema, Document} from 'mongoose';

export interface Feature extends Document {
    title: string;
    description: string;
    image: string;
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
    image: {
        type: String,
        required: true,
        trim: true
    }
});


export interface Project extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    features: [Feature];
    link: string;
    technologies: Array<String>
    image: string;
}

const projectSchema: Schema<Project> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    features: [featureSchema],
    link: {
        type: String,
        required: true,
        trim: true
    },
    technologies: [String],
    image: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

const ProjectModel = mongoose.models.Project as mongoose.Model<Project> || mongoose.model('Project', projectSchema);

export default ProjectModel;