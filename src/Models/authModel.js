import mongoose from "mongoose";

const authScheme = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
})
const authModel = mongoose.model("auth", authScheme);
export default authModel;