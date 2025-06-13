import { Router } from "express";
import passport from "passport";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    googleCallbackHandler,
    verifyLoginSession
} from '../controllers/auth.controller'
import { createValidationMiddleware } from "../utils/createValidationMiddleware";
import { RegisterUserSchema } from "../schemas/user.schema";
import { LoginUserSchema } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";

  const validateRegistration = createValidationMiddleware(RegisterUserSchema);
   const validateLogin = createValidationMiddleware(LoginUserSchema);


const router = Router();


router.route('/register-user').post(validateRegistration,registerUser);
router.route('/login-user').post(validateLogin,loginUser);
router.route('/logout-user').post(verifyJWT,logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/verify-login').post(verifyJWT,verifyLoginSession);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallbackHandler // <-- This controller sends accessToken + refreshToken
);  

export default router; 