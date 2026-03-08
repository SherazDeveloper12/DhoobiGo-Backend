import mongoose from "mongoose";
import authModel from "../Models/authModel.js";
import otpModel from "../Models/otpModel.js";
import jwt from "jsonwebtoken";
import axios from "axios";
export const createOtp = async (req, res) => {
    const { phoneNumber } = req.params;
    try {
        const existingOtp = await otpModel.findOne({ phoneNumber });
        if (existingOtp) {
          if (existingOtp.expiresAt < Date.now()) {
                console.log("existing otp expires at:", new Date(existingOtp.expiresAt));
                console.log("current time:", new Date());
                await otpModel.deleteOne({ _id: existingOtp._id });
            }else {
                const timeLeft = existingOtp.expiresAt - Date.now();
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
                return res.status(400).json({ message: `An OTP has already been sent to this phone number. Please wait ${minutes} minutes and ${seconds} seconds before requesting a new one.`, otpsend: false });
            }

        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 3 * 60 * 1000;
        const data = {
            to: phoneNumber,
            message: `Your DhoobGo 6-Digit OTP code is ${otpCode}. Please do not share it with anyone. Your OTP is valid for 3 minutes.`
        };
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.OTP_API_URL}`,
            headers: {
                'Authorization': `${process.env.OTP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: data
        };
        const OtpApiResponse = await axios.request(config);
        console.log("OTP API Response status:", OtpApiResponse.status);
        if (OtpApiResponse.status === 200) {
            console.log("OTP sent successfully to:", phoneNumber);
            const otpEntry = {
                phoneNumber,
                otpCode,
                expiresAt,
            }
            const newOtp = new otpModel(otpEntry);
            await newOtp.save();
            res.status(200).json({ message: "OTP created successfully", otpsend: true });
        }
        else {
            return res.status(500).json({ message: "Failed to send OTP", otpsend: false, error: OtpApiResponse.data });
        }

    } catch (error) {
        console.error("Error in createOtp:", error);
        res.status(500).json({ message: "Error creating OTP", error, otpsend: false });
    }
}
export const authenticateUser = async (req, res) => {
    console.log("Received request body:", req.body);
    const { phoneNumber } = req.body;
    const {  otpCode } = req.body;
    console.log("Received phoneNumber:", phoneNumber);
    console.log("Received otpCode:", otpCode);
    try {
        
        const otpEntry = await otpModel.findOne({ phoneNumber });
        console.log("OTP entry found:", otpEntry);
        if (!otpEntry || otpEntry.otpCode !== otpCode || otpEntry.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Here you would typically remove the OTP entry or mark it as used
        await otpModel.deleteOne({ _id: otpEntry._id });
        const user = await authModel.findOne({ phoneNumber });
        if (!user) {
            const newUser = new authModel({ phoneNumber });
            await newUser.save();
            const token = jwt.sign({ _id: newUser._id, phoneNumber }, process.env.JWT_SECRET,);
            res.status(201).json({ message: "User created and authenticated successfully", newUser, token });
        }

        // For now, we'll just return a success message
        const token = jwt.sign({ _id: user._id, phoneNumber }, process.env.JWT_SECRET,);
        res.status(200).json({ message: "User authenticated successfully", user, token });
    } catch (error) {

        res.status(500).json({ message: "Error authenticating user", error });
    }
}
export const getUserProfile = async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const _id = decoded._id;
    try {
        const user = await authModel.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User profile retrieved successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user profile", error });
    }
}
export const getAllUsers = async (req, res) => { }
export const getUserById = async (req, res) => { }
export const updateUser = async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const _id = decoded._id;
    try {
        const user = await authModel.findByIdAndUpdate(_id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
}
export const deleteUser = async (req, res) => { }
