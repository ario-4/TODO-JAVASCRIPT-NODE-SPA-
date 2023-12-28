import express from 'express';
import TaskControler from '../controllers/tasks.js';




const router = express.Router();



router.get("/tasks" ,TaskControler.getTask);

router.get("/tasks/:id" ,TaskControler.getTaskById);

router.post("/tasks" ,TaskControler.addTask);

router.put("/tasks/:id" ,TaskControler.updateTask);

router.delete("/tasks/:id" ,TaskControler.deleteTask);




export default router;