import express from "express";
import { DeleteAccount, ForgotPassword, GetMe, RefreshToken, ResendVerificationEmail, ResetPassword, SignIn, SignOut, SignUp, VerifyEmail } from "../controllers/auth.controller.js";
import { authenticated, } from "../middleware/protectedRoute.middleware.js";

const authRouter = express.Router();

// Authentication 
authRouter.post("/sign-in", SignIn);
authRouter.post("/sign-up", SignUp);
authRouter.post("/sign-out", SignOut);
authRouter.post("/forgot-password", ForgotPassword);   
authRouter.post("/resend-verification", ResendVerificationEmail);   
authRouter.post("/verify-email", VerifyEmail);
authRouter.post("/refresh-token", RefreshToken);
authRouter.patch("/reset-password", ResetPassword); 
authRouter.delete("/delete-account", DeleteAccount);  
authRouter.get("/users/me", authenticated, GetMe);

export default authRouter;