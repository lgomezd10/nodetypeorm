import { Router } from "express";
import SuppliersController from "../controller/SuppliersController";
import { checkJwt } from "../middlewares/jwt";

const router = Router();

router.get('/', [checkJwt], SuppliersController.getAll);
router.get('/:id', [checkJwt], SuppliersController.getOneSupplier)
router.post('/new', [checkJwt], SuppliersController.postNewSupplier);
router.post('/update/:id', [checkJwt], SuppliersController.postUpdateSupplier);

export default router;