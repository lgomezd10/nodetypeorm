import { Router } from "express";
import SalesController from "../controller/SalesController";
import { checkJwt } from "../middlewares/jwt";

const router = Router();

// get a sale
router.get('/sale/:id', [checkJwt], SalesController.getSale);

// Save sales
router.post('/', [checkJwt], SalesController.postSale);

// Update sales
router.post('/update/:id', [checkJwt], SalesController.postUpdateSale);


// get a sale
router.post('/date', [checkJwt], SalesController.postSalesByDate);

export default router;