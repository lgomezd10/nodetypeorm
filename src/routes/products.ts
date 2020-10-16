import { Router } from "express";
import ProductsController from '../controller/ProductsController';
import { checkJwt } from "../middlewares/jwt";

const router = Router();

// show All product
router.get('/', [checkJwt], ProductsController.getAllProduct);

// show single product
router.get('/:id', [checkJwt], ProductsController.getOneProduct);

//add new product
router.post('/',  [checkJwt], ProductsController.postNewProduct);

// update product
router.post('/:id',  [checkJwt], ProductsController.postUpdateProduct);

// delete product TODO: this method can't be used
router.delete('/:id',  [checkJwt], ProductsController.deleteProduct);

export default router;