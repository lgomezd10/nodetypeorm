import { Router } from "express";
import sales from './sales';
import products from './products';
import purchases from './purchases';

const routes = Router();

routes.use('/products', products);
routes.use('/purchases', purchases);
routes.use('/sales', sales);

export default routes;