import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const UserModel: mongoose.Model<IUser> = 
mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default UserModel;