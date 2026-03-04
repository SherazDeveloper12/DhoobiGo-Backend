import mongoose from "mongoose";
import authModel from "../Models/authModel.js";

export const userExistCheck = async (req, res) => {
    const { phoneNumber } = req.params;
    console.log(phoneNumber);
    try {
        const user = await authModel.findOne({ phoneNumber });
        if (user) {
            return res.status(200).json({ message: "User exists", user, userExist: true });
        } else {
            return res.status(404).json({ message: "User does not exist", userExist: false });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error checking user existence", error });
    }
}
export const register = async (req, res) => { }
export const login = async (req, res) => { }
export const getAllUsers = async (req, res) => { }
export const getUserById = async (req, res) => { }
export const updateUser = async (req, res) => { }
export const deleteUser = async (req, res) => { }
