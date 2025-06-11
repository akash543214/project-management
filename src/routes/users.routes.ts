import { Router } from "express";
import {
 updateUser,
 deleteUser,
 getUserById
} from '../controllers/user.controller'
//import { createValidationMiddleware } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route('/update-profile').patch(verifyJWT,updateUser);
router.route('/delete-profile').delete(verifyJWT,deleteUser);
router.route('/get-profile/:id').get(verifyJWT,getUserById);

export default router; 