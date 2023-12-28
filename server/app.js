import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';



import taskRouts from './router/tasks.js';




const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use((req, res , next) => {
    res.setHeader("Access-Control-Allow-Origin" , "*")
    res.setHeader("Access-Control-Allow-Headers" , "*")
    res.setHeader("Access-Control-Allow-Methods" , "*")
    next();
    
})


app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.use(taskRouts);


try {
    app.listen(3001);
    console.log('conected with port 3001');
} catch (error) {
    
}


export {__dirname as rootPath}
