import express from "express";
import {
    userExistCheck,
  register,
  login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../Controllers/authController.js";

const AuthRouter = express.Router();

AuthRouter.get("/user-exist/:phoneNumber", userExistCheck);
AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.get("/users", getAllUsers);
AuthRouter.get("/users/:id", getUserById);
AuthRouter.put("/users/:id", updateUser);
AuthRouter.delete("/users/:id", deleteUser);

export default AuthRouter;