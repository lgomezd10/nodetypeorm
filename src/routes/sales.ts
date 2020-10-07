import { Router } from "express";
import SalesController from "../controller/SalesController";

const routes = Router();

// get a sale
routes.get('/sale/:id', SalesController.getSale);

// Save sales
routes.post('/', SalesController.postSales);

// Update sales
routes.post('/update/:id', SalesController.postUpdateSales);


// get a sale
routes.post('/date', SalesController.postSalesByDate);

export default routes;