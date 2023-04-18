import mongoose, { Schema, Document } from "mongoose";

export interface IResponse extends Document {
  input: string;
  output: string;
  userId: Schema.Types.ObjectId;
}

const ResponseSchema: Schema = new Schema({
  input: { type: String, required: true, unique: true },
  output: { type: String, required: true },
  userId: Schema.Types.ObjectId,
});

export default mongoose.model<IResponse>("Response", ResponseSchema);
