// models/Job.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
    title: string;
    salary: string;
    location: string;
    time: string;
    color: string;
    category?: string;
    phone?: string;
}

const JobSchema: Schema = new Schema({
    title: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String, required: true },
    color: { type: String, required: true },
    category: { type: String },
    phone: { type: String },
});

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
