import express from 'express';
import ClassesControllers from '../controllers/classesControllers';
const routes = express.Router();

const classesControllers = new ClassesControllers();


routes.get('/', classesControllers.index);

routes.post('/', classesControllers.create);

export default routes
