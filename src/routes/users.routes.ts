import { Router } from "express";
import {
 updateUser,
 deleteUser
} from '../controllers/user.controller'
import { createValidationMiddleware } from "../schemas/user.schema";
import { RegisterUserSchema } from "../schemas/user.schema";
import { LoginUserSchema } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";

  const validateRegistration = createValidationMiddleware(RegisterUserSchema);
   const validateLogin = createValidationMiddleware(LoginUserSchema);


const router = Router();

router.route('/update-profile').post(verifyJWT,updateUser);
router.route('/delete-profile').post(verifyJWT,deleteUser);


export default router; 