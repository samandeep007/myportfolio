import mongoose, {Document, Schema} from 'mongoose';

export interface ICertificate extends Document{
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    company: string;
    certificateNumber: string;
    completionDate: Date;
    skills: Array<String>;
    link: string;
    document: string;
}

const CertificateSchema: Schema<ICertificate> = new Schema({
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

    company: {
        type: String,
        required: true,
        trim: true
    },

    certificateNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    completionDate: {
        type: Date,
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    link: {
        type: String,
        required: true,
        trim: true
    },

    document: {
        type: String,
        required: true  
    }
}, {timestamps: true});

const CertificateModel = mongoose.models.Certificate as mongoose.Model<ICertificate> || mongoose.model('Certificate', CertificateSchema);
export default CertificateModel;
