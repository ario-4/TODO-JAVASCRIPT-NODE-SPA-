
import Task from '../models/task.js';
import DB from '../models/db.js';






export default class TaskControler {


    //get  tasks

    static getTask(req, res) {
        let pages = 1,
            limit = 4,
            finished = undefined,
            search = ''
          
        if (req.query.pages > 0) {
            pages = parseInt(req.query.pages)
        }
        if (req.query.limit > 0) {
            limit = parseInt(req.query.limit)
        }
        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.finished === 'true' || req.query.finished === 'false') {
            finished = req.query.finished === 'true' ? true : false
        }
        try {
            let tasks = DB.getAllTask()
             tasks = tasks.filter((item)=> item.title.includes(search))

             if(finished != undefined){
                tasks = tasks.filter((item)=> item.completed === finished)
                console.log(tasks);
             }
             
             const totalTasks = tasks.length
             const start = (pages - 1) * limit;
             const allTask = tasks
              tasks = tasks.slice(start , start + limit)
             
            res.json({
                success: true,
                body: tasks,
                message: 'all tasks fetched',
                totalTasks,
                finished : req.query.finished,
                allTask
               
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                body: null,
                message: 'internal server error'
            })
        }
    }




    //get one task

    static getTaskById(req, res) {

        try {
            const id = req.params.id
            console.log(id);
            const task = Task.getTaskById(id)
            console.log(task);
            if (task) {
                res.json({
                    success: true,
                    body: task,
                    message: 'the task fetched successfully'
                })
            } else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: 'task not fond'
                })
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                body: null,
                message: 'server error'
            })
        }
    }


    //--add task

    static addTask(req, res) {
        let title = ''
        let completed;

        if (req.body.title) {
            title = req.body.title;
            completed = req.body.completed

            if (Task.getTaskByTitle(title)) {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: 'a task already exists whith this title '
                })
            }

            try {
                const task = new Task(
                    title,
                    completed
                );

                task.save();
                const tasks = Task.getAllTask()
                const totalTasks = tasks.length
                res.status(201).json({
                    success: true,
                    body: task,
                    message: 'add new task successfully',
                    totalTasks,
                    tasks
                })

            } catch (e) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: e.message
                })
            }
        }
        else {
            res.status(500).json({
                success: false,
                body: null,
                message: 'Invalid request.'
            })

        }
    }


    //--updat Task



    static updateTask(req, res) {
        if (req.body.title && req.body.completed !== undefined) {

            const { title, completed } = req.body
            let task = Task.getTaskByTitle(title);

            if (task && task.id != req.params.id) {
                return res.ststus(409).json({
                    success: false,
                    body: null,
                    message: 'a task already exixts with this title'
                })
            }

            task = Task.getTaskById(req.params.id)
            if (task ) {
                try {
                    task.title = title;
                    task.completed = completed;
                    try {
                        task.save();
                    } catch (error) {
                        res.json({
                            success: false,
                            body: null,
                            message: 'cant save task'
                        })
                    }

                    res.json({
                        success: true,
                        body: task,
                        message: 'task updated'
                    });
                } catch (error) {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: error.message
                    })
                }

            } else {
                res.status(404).json({
                    succsess: false,
                    body: null,
                    message: 'task not found'
                })
            }

        }
    }





    // delete task

    static deleteTask(req, res) {
        const task = Task.getTaskById(req.params.id)
        let tasks;

        try {
            if (task) {

                DB.deleteTassk(req.params.id)
                tasks = Task.getAllTask()
                res.json({
                    success: true,
                    body: null,
                    message: 'task deleted successfully'
                })

            } else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: 'task not found'
                })
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                body: null,
                message: 'task not found'
            })
        }
    }

}











