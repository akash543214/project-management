import { Router } from "express";
import {
 updateUser,
 deleteUser,
} from '../controllers/user.controller'
//import { createValidationMiddleware } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route('/update-profile').patch(verifyJWT,updateUser);
router.route('/delete-profile').delete(verifyJWT,deleteUser);

export default router; 