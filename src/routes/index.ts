import { Router } from "express";
import sales from './sales';
import products from './products';
import purchases from './purchases';
import users from './users';
import auth from './auth'

const routes = Router();

routes.use('/products', products);
routes.use('/purchases', purchases);
routes.use('/sales', sales);
routes.use('/users', users);
routes.use('/auth', auth);

export default routes;