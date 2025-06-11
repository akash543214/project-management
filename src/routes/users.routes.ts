import { Router } from "express";
import {
 updateUser,
 deleteUser,
} from '../controllers/user.controller'
//import { createValidationMiddleware } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createValidationMiddleware } from "../utils/createValidationMiddleware";
import { UpdateProfileSchema } from "../schemas/user.schema";

const validateUpdateUser = createValidationMiddleware(UpdateProfileSchema);

const router = Router();

router.route('/update-profile').patch(verifyJWT,validateUpdateUser,updateUser);
router.route('/delete-profile').delete(verifyJWT,deleteUser);

export default router; 