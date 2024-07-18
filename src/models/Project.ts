import mongoose, {Schema, Document} from 'mongoose';




export interface Project extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
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