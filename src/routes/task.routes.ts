import { Router } from "express";
import {
     createTask,
    deleteTask,
    updateTask,
    getTopLevelTasks,
    getTaskById,
    getAllSubtasks,
    getFirstLevelSubtasks,
    getTopTasksWithChildren,
    getTasksWithAllSubtasks 
} from '../controllers/task.controller'
import { verifyJWT } from "../middlewares/auth.middleware";
import { CreateTaskSchema } from "../schemas/task.schema";
import { UpdateTaskSchema } from "../schemas/task.schema";
import { createValidationMiddleware } from "../utils/createValidationMiddleware";
const validateTaskData = createValidationMiddleware(CreateTaskSchema);
const validateUpdateTaskData = createValidationMiddleware(UpdateTaskSchema);
const router = Router();

router.route('/top-level-tasks/:projectId').get(verifyJWT,getTopLevelTasks);
router.route('/tasks-with-firstlevel-subtaks/:projectId').get(verifyJWT,getTopTasksWithChildren);
router.route('/tasks-with-allsubtasks/:projectId').get(verifyJWT,getTasksWithAllSubtasks);
router.route('/get-task/:taskId').get(verifyJWT,getTaskById);
router.route('/allsubtasks/:taskId').get(verifyJWT,getAllSubtasks);
router.route('/get-firstlevel-tasks/:taskId').get(verifyJWT,getFirstLevelSubtasks);
router.route('/delete-task/:taskId').delete(verifyJWT,deleteTask);
router.route('/update-task/:taskId').patch(verifyJWT,validateUpdateTaskData,updateTask);
router.route('/create-task/:projectId').post(verifyJWT,validateTaskData,createTask);


export default router; 