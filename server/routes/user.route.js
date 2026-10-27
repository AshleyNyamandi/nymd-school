import express from "express";
import { deleteUser, getAllUsers, getUserById, updateUserRole } from "../controllers/user.controller.js";

import { authenticated, restrictTo } from "../middleware/protectedRoute.middleware.js";

const userRouter = express.Router();

// User management is reserved for administrators.
userRouter.use(authenticated, restrictTo("admin"));

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id/role", updateUserRole);
userRouter.delete("/:id", deleteUser);


export default userRouter;