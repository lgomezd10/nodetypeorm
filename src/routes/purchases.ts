import { Router } from "express";
import PurchasesController from "../controller/PurchasesController";


const routes = Router();

// Save purchase list
routes.post('/', PurchasesController.postPurchasesList);

// find purchase for date

routes.post('/date', PurchasesController.postDatePurchase);

export default routes;