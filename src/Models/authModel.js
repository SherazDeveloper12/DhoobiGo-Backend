import mongoose from "mongoose";

const authScheme = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String, },
})
const authModel = mongoose.model("auth", authScheme);
export default authModel;