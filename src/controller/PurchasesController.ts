import { validate, validateSync } from "class-validator";
import { Request, Response } from "express";
import { Between, getRepository } from "typeorm";
import { Product } from "../entity/Product";
import { Purchase } from "../entity/Purchase";

class PurchasesController {
    static postPurchasesList = async (req: Request, res: Response) => {

        const purchaseRepository = getRepository(Purchase);
        let reqPurchases = req.body;
        const {userId} = res.locals.jwtPayload;
        let errors = [];

        let purchases: Purchase[] = [];

        reqPurchases.forEach(reqPurchase => {
            const purchase: Purchase = new Purchase();
            //TODO pensar si poner req.Purchase.product? y añadir req.productId?
            purchase.productId = reqPurchase.productId || reqPurchase.product?.id;
            purchase.price = reqPurchase.price;
            purchase.quantity = reqPurchase.quantity;
            purchase.supplierId = reqPurchase.supplierId;
            purchase.userId = userId;
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
            let saved = await purchaseRepository.save(purchases);
            res.send(saved);
        } catch (error) {
            return res.status(400).json({ message: 'Error saving purchases', error });
        }     

    }

    static postDatePurchase = async (req: Request, res: Response) => {
        const purchaseRepository = getRepository(Purchase);
        const {from, to} = req.body;
        const { userId } = res.locals.jwtPayload;
        let purchases;
        if (!(req.body.from && req.body.to)) {
            return res.status(400).json({message: 'from and to required'})
        }

        try{
            purchases = await purchaseRepository.find({relations: ["product"],where:{ userId, date: Between(from, to)}});
            res.send(purchases);
        }
        catch(e) {
            return res.status(400).json({errors:e});
        }
    }
}

export default PurchasesController;