import { validateSync } from "class-validator";
import { json, Request, Response } from "express";
import { Between, getRepository } from "typeorm";
import { Product } from "../entity/Product";
import { ItemSale } from "../entity/ItemSale";
import { Sale } from "../entity/Sale";

class SalesController {

    static postNewSale = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sale);
        const itemsRepository = getRepository(ItemSale);
        let sale = new Sale();
        let saved: Sale;
        let items = req.body.itemsSale;
        sale.creditCard = req.body.crediCard;
        sale.userId = res.locals.jwtPayload.userId;

        if (!(items && (items.length > 0))) {
            return res.status(400).json({ message: 'there arent sales to save' });
        }

        const outcome = Sale.validateItemsSale(items);

        if (outcome.errors.length > 0) {
            return res.status(400).json({ message: 'Error to validate items. Saved Nothing', error: outcome.errors });
        }

        try {
            saved = await salesRepository.save(sale);
        } catch (error) {
            return res.status(400).json({ message: 'Error to save sale', error });
        }

        outcome.items.forEach((element: ItemSale) => {
            element.sale = saved;
        });

        try {
            await itemsRepository.save(outcome.items);
            res.json({ message: 'saved sales', saleId: saved.id })

        } catch (error) {
            await salesRepository.delete(saved);
            return res.status(400).json({ message: 'Errors saving sales. Deleted sale', errors: error });
        }

    }


    static postUpdateSale = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sale);
        const itemsRepository = getRepository(ItemSale);
        let errors = [];
        const { creditCard } = req.body;
        let saleId: number = +req.params.id;
        const userId = res.locals.jwtPayload.userId;
        let sale: Sale;
        let items = req.body.itemsSale;
        let outcome;
        let toDrop: ItemSale[] = [];
        let toSave: ItemSale[] = [];
        let dropSale: boolean = false;

        // TODO: Eliminar la venta si no quedan items
        /*if (!(items && (items.length > 0))) {
            return res.status(400).json({ message: 'there arent sales to save' });
        }*/
       
        try {
            sale = await salesRepository.findOneOrFail({ where: { id: saleId, userId } });
        } catch (error) {
            return res.status(404).json({ message: `SaleId: ${saleId}  not found`, Errors: error });
        }

        
        if (!items || items.length == 0) {
            try {
                toDrop = await itemsRepository.find({ where: { sale: sale } });
                dropSale = true;
            } catch (error) {
                return res.status(400).json({ message: 'error to find saved items', error });
            }

        } else {
            outcome = Sale.validateItemsSale(items, saleId);
            //TODO: Ver si los errores que se pasan al cliente son error o errors
            if (outcome.errors.length > 0) {
                return res.status(400).json({ message: 'Error to validate new sales. Not changes', error: outcome.errors });
            }

            // Add only items is not in BBDD and remove if not in list
            toSave = outcome.items;
            let itemsSaved = await itemsRepository.find({ where: { sale: sale } });
            if (toSave.length == 0) {
                toDrop = itemsSaved;
            } else {
                itemsSaved.forEach(item => {

                    let index = toSave.findIndex((element: ItemSale) => item.equal(element));

                    if (index >= 0) toSave.splice(index, 1);
                    else toDrop.push(item);

                });
            }
        }

        // save new items
        try {
            if (toSave.length > 0) await itemsRepository.save(toSave);            
        } catch (error) {
            return res.status(400).json({ message: 'Error to save new item after. Not changes', error });
        }


        try {
            if (toDrop.length > 0) await itemsRepository.remove(toDrop);
            if (dropSale) {
                await salesRepository.remove(sale);
                saleId = 0;
            }
            else if (creditCard != sale.creditCard) {
                sale.creditCard = creditCard;
                await salesRepository.save(sale);
            }
        } catch (error) {
            return res.status(400).json({ message: 'Error to update sale or remove old items', error });
        }

        let message = dropSale? 'Deleted sale': 'Saved sale'
        res.json({ message: message, saleId })


    }

    static getSale = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sale);
        const itemsRepository = getRepository(ItemSale);
        const { id } = req.params;
        const userId = res.locals.jwtPayload.userId;
        let sale: Sale;

        try {
            sale = await salesRepository.findOneOrFail({ where: { id, userId } });
        } catch (error) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        try {
            sale.itemsSale = await itemsRepository.find({ relations: ["product"], where: { sale: sale } });
            res.send(sale);
        } catch (error) {
            return res.status(404).json({ message: 'Sales not found' });
        }


    }

    static postSalesByDate = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sale);
        const { from, to } = req.body;
        const userId = res.locals.jwtPayload.userId;
        let sale;

        if (!(req.body.from && req.body.to)) {
            return res.status(400).json({ message: 'from and to required' })
        }

        try {

            sale = await salesRepository.find({ relations: ["itemsSale"], where: { date: Between(from, to), userId } });
            res.send(sale);
        }
        catch (error) {
            return res.status(400).json({ error });
        }

    }

}

export default SalesController;