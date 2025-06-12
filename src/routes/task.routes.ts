import { Router } from "express";
import {
     createTask,
    deleteTask,
    updateTask,
    getTopLevelTasks,
    getTaskById 
} from '../controllers/task.controller'
import { verifyJWT } from "../middlewares/auth.middleware";
import { CreateTaskSchema } from "../schemas/task.schema";
import { UpdateTaskSchema } from "../schemas/task.schema";
import { createValidationMiddleware } from "../utils/createValidationMiddleware";
const validateTaskData = createValidationMiddleware(CreateTaskSchema);
const validateUpdateTaskData = createValidationMiddleware(UpdateTaskSchema);
const router = Router();

router.route('/top-level-tasks/:projectId').get(verifyJWT,getTopLevelTasks);
router.route('/task/:id').get(verifyJWT,getTaskById);
router.route('/delete-task/:id').delete(verifyJWT,deleteTask);
router.route('/update-task/:id').patch(verifyJWT,validateUpdateTaskData,updateTask);
router.route('/create-task').post(verifyJWT,validateTaskData,createTask);


export default router; 