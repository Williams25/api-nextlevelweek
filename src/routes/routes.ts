import express from 'express';
import usersRoutes from './classesRoutes'
import connectionsRoutes from './connectionsRoutes'
const routes = express();

routes.use('/connections', connectionsRoutes)
routes.use('/classes', usersRoutes)

export default routes