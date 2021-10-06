import { Router } from "express";
import sales from './sales';
import products from './products';
import purchases from './purchases';
import users from './users';
import auth from './auth';
import suppliers from "./suppliers";
import { Supplier } from "../entity/Supplier";
import SuppliersController from "../controller/SuppliersController";

const routes = Router();

routes.use('/products', products);
routes.use('/purchases', purchases);
routes.use('/sales', sales);
routes.use('/users', users);
routes.use('/auth', auth);
routes.use('/suppliers', suppliers);

export default routes;