import { Router } from "express";
import {
     createProject,
    deleteProject,
    updateProject,
    getProjects 
} from '../controllers/project.controller'
//import { createValidationMiddleware } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route('/get-projects').get(verifyJWT,getProjects);
router.route('/delete-project').delete(verifyJWT,deleteProject);
router.route('/update-project').patch(verifyJWT,updateProject);
router.route('/create-project').post(verifyJWT,createProject);


export default router; 