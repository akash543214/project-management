import { Router } from "express";
import {
     createProject,
    deleteProject,
    updateProject,
    getAllProjects,
    getProjectsById 
} from '../controllers/project.controller'
//import { createValidationMiddleware } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createValidationMiddleware } from "../utils/createValidationMiddleware";
import { CreateProjectSchema } from "../schemas/project.schema";

const validateProjectData = createValidationMiddleware(CreateProjectSchema);


const router = Router();

router.route('/get-projects').get(verifyJWT,getAllProjects);
router.route('/get-project/:id').get(verifyJWT,getProjectsById);
router.route('/delete-project/:id').delete(verifyJWT,deleteProject);
router.route('/update-project').patch(verifyJWT,validateProjectData,updateProject);
router.route('/create-project').post(verifyJWT,validateProjectData,createProject);


export default router; 