import express from "express";
import { deleteUser, getAllUsers, getUserById, updateUserRole } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id/role", updateUserRole);
userRouter.delete("/:id", deleteUser);


export default userRouter;