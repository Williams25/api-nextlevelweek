import express from 'express';
import ConnectionsControllers from '../controllers/connectionsControllers';
const routes = express.Router();

const connectionsControllers = new ConnectionsControllers()

routes.get('/', connectionsControllers.index)
routes.post('/', connectionsControllers.create)

export default routes