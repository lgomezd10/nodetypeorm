import { validate, validateSync } from "class-validator";
import { Request, Response } from "express";
import { Between, getRepository } from "typeorm";
import { Product } from "../entity/Product";
import { Purchases } from "../entity/Purchases";

class PurchasesController {
    static postPurchasesList = async (req: Request, res: Response) => {

        const purchaseRepository = getRepository(Purchases);
        let reqPurchases = req.body;
        let errors = [];

        let purchases: Purchases[] = [];

        reqPurchases.forEach(reqPurchase => {
            const purchase: Purchases = new Purchases();
            purchase.product = reqPurchase.product;
            purchase.price = reqPurchase.price;
            purchase.quantity = reqPurchase.quantity;
            const error = validateSync(purchase);
            if (error.length > 0) {
                errors.push(error);
            }
            purchases.push(purchase);
        });
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Errors validating the purchases. Saved nothing', errors });
        }

        try {
            await purchaseRepository.save(reqPurchases);
            res.json({ message: 'Saved purchases' });
        } catch (e) {
            res.status(400).json({ message: 'Error saving purchases', error: e });
        }     

    }

    static postDatePurchase = async (req: Request, res: Response) => {
        const purchaseRepository = getRepository(Purchases);
        const {from, to} = req.body;
        let purchases;
        if (!(req.body.from && req.body.to)) {
            return res.status(400).json({message: 'from and to required'})
        }

        try{
            purchases = await purchaseRepository.find({relations: ["product"],where:{date: Between(from, to)}});
            res.send(purchases);
        }
        catch(e) {
            res.status(400).json({errors:e});
        }
    }
}

export default PurchasesController;