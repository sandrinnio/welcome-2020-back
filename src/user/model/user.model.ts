import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const UserModel = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  verifyString: { type: String },
  verified: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
  ticket: { type: String },
  created_at: { type: Date, default: Date.now() },
});
