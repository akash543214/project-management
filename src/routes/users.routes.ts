import { Router } from "express";
import {
    registerUser,
    loginUser
} from '../controllers/user.controller'
import { createValidationMiddleware } from "../schemas/user.schema";
import { RegisterUserSchema } from "../schemas/user.schema";
import { LoginUserSchema } from "../schemas/user.schema";

  const validateRegistration = createValidationMiddleware(RegisterUserSchema);
   const validateLogin = createValidationMiddleware(LoginUserSchema);


const router = Router();


router.route('/signin').post(validateRegistration,registerUser);
router.route('/login-user').post(validateLogin,loginUser);
export default router;