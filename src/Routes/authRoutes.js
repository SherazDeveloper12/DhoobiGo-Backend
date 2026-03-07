import express from "express";
import {
  createOtp,
  authenticateUser,
  getUserProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../Controllers/authController.js";

const AuthRouter = express.Router();

AuthRouter.post("/createOtp/:phoneNumber", createOtp);
AuthRouter.post("/authenticateUser", authenticateUser);
AuthRouter.get("/profile", getUserProfile);
AuthRouter.get("/users", getAllUsers);
AuthRouter.get("/users/:id", getUserById);
AuthRouter.put("/users/:id", updateUser);
AuthRouter.delete("/users/:id", deleteUser);

export default AuthRouter;