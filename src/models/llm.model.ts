import mongoose, { Schema, Document } from "mongoose";

export interface ILLM extends Document {
  name: string;
}

const LLMSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model<ILLM>("LLM", LLMSchema);
