import mongoose from "mongoose";

const otpScheme = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    otpCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
})
const otpModel = mongoose.model("otp", otpScheme);
export default otpModel;