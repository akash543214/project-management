import { Router } from "express";
import {
    registerUser
} from '../controllers/user.controller'
import { createValidationMiddleware } from "../schemas/user.schema";
import { RegisterUserSchema } from "../schemas/user.schema";

 export const validateRegistration = createValidationMiddleware(RegisterUserSchema);


const router = Router();


router.route('/signin').post(validateRegistration,registerUser);

export default router;