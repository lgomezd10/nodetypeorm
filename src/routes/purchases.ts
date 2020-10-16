import { Router } from "express";
import PurchasesController from "../controller/PurchasesController";
import { checkJwt } from "../middlewares/jwt";


const router = Router();

// Save purchase list
router.post('/', [checkJwt], PurchasesController.postPurchasesList);

// find purchase for date

router.post('/date', [checkJwt], PurchasesController.postDatePurchase);

export default router;