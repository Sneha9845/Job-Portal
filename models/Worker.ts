// models/Worker.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IWorker extends Document {
    name: string;
    phone: string;
    skill: string;
    location: string;
    assignedJobId?: string | null;
    assignmentDetails?: {
        jobId: string;
        location: string;
        guideName: string;
        guidePhone: string;
        reportingTime: string;
        instructions: string;
        salary: string;
    };
}

const WorkerSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    skill: { type: String, required: true },
    location: { type: String, required: true },
    assignedJobId: { type: String, default: null },
    assignmentDetails: {
        jobId: { type: String },
        location: { type: String },
        guideName: { type: String },
        guidePhone: { type: String },
        reportingTime: { type: String },
        instructions: { type: String },
        salary: { type: String },
    },
});

export default mongoose.models.Worker || mongoose.model<IWorker>("Worker", WorkerSchema);
