import { Router } from "express";
import ProductsController from '../controller/ProductsController';

const routes = Router();

// show All product
routes.get('/', ProductsController.getAllProduct);

// show single product
routes.get('/:id', ProductsController.getOneProduct);

//add new product
routes.post('/', ProductsController.postNewProduct);

// update product
routes.post('/:id', ProductsController.postUpdateProduct);

// delete product TODO: this method can't be used
routes.delete('/:id', ProductsController.deleteProduct);

export default routes;