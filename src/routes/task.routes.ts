import { Router } from "express";
import {
     createTask,
    deleteTask,
    updateTask,
    getTasks 
} from '../controllers/task.controller'
//import { createValidationMiddleware } from "../schemas/user.schema";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route('/get-tasks').get(verifyJWT,getTasks);
router.route('/delete-task').delete(verifyJWT,deleteTask);
router.route('/update-task').patch(verifyJWT,updateTask);
router.route('/create-task').post(verifyJWT,createTask);


export default router; 