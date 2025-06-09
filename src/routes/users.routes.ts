import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser
} from '../controllers/user.controller'
import { createValidationMiddleware } from "../schemas/user.schema";
import { RegisterUserSchema } from "../schemas/user.schema";
import { LoginUserSchema } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";

  const validateRegistration = createValidationMiddleware(RegisterUserSchema);
   const validateLogin = createValidationMiddleware(LoginUserSchema);


const router = Router();


router.route('/signin').post(validateRegistration,registerUser);
router.route('/login-user').post(validateLogin,loginUser);
router.route('/logout-user').post(verifyJWT,logoutUser);

export default router;