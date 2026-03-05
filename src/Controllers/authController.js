import mongoose from "mongoose";
import authModel from "../Models/authModel.js";
import otpModel from "../Models/otpModel.js";
import axios from "axios";
export const createOtp = async (req, res) => {
    const { phoneNumber } = req.params;
    console.log("Received phone number for OTP:", phoneNumber);
    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000;
        const data = {
            to: phoneNumber,
            message: `Your DhoobGo 6-Digit OTP code is ${otpCode}. Please do not share it with anyone. Your OTP is valid for 5 minutes.`
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
        res.status(500).json({ message: "Error creating OTP", error, otpsend: false });
    }
}
export const authenticateUser = async (req, res) => {
    try {

    } catch (error) {

    }
}
export const getAllUsers = async (req, res) => { }
export const getUserById = async (req, res) => { }
export const updateUser = async (req, res) => { }
export const deleteUser = async (req, res) => { }
