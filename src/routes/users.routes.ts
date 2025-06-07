import { Router } from "express";

import {
    registerUser
} from '../controllers/user.controller'


const router = Router();


router.route('/signin').post(registerUser);

export default router;