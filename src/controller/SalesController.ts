import { validateSync } from "class-validator";
import { Request, Response } from "express";
import { Between, getRepository } from "typeorm";
import { Product } from "../entity/Product";
import { ItemSale } from "../entity/ItemSale";
import { Sale } from "../entity/Sale";

class SalesController {

    static postSale = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sale);
        const itemsRepository = getRepository(ItemSale);
        let sale = new Sale();
        let saved: Sale;
        let items = req.body.itemsSale;
        sale.creditCard = req.body.crediCard;
        sale.userId = res.locals.jwtPayload.userId;

        console.log("Desde SalesController recibido itemsales", items);

        if (!(items && (items.length > 0))) {
            return res.status(400).json({ message: 'there arent sales to save' });
        }

        const outcome = Sale.validateItemsSale(items);

        if (outcome.errors.length > 0) {
            return res.status(400).json({ message: 'Error to validate items. Saved Nothing', errors: outcome.errors });
        }


        try {
            saved = await salesRepository.save(sale);
            console.log("Desde Sales Controller. No debería guardarse si falla", saved);
        } catch (error) {
            res.status(400).json({ message: 'Error to save sales', error });
        }

        outcome.items.forEach((element: ItemSale) => {
            element.sale = saved;
        });

        try {
            await itemsRepository.save(outcome.items);
            res.json({ message: 'saved sales', salesId: saved.id })

        } catch (error) {
            await salesRepository.delete(saved);
            res.status(400).json({ message: 'Errors saving sales. Deleted sales', errors: error });
        }

    }


    static postUpdateSale = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sale);
        const itemsRepository = getRepository(ItemSale);
        let errors = [];
        const { creditCard } = req.body;
        const saleId: any = req.params.id;
        const userId = res.locals.jwtPayload.userId;
        let sale: Sale;
        let items = req.body.itemsSale;
        let outcome;
        let itemsToAdd: ItemSale[];
        let toDrop: ItemSale[] = [];

        // TODO: Eliminar la venta si no quedan items
        /*if (!(items && (items.length > 0))) {
            return res.status(400).json({ message: 'there arent sales to save' });
        }*/

        try {
            sale = await salesRepository.findOneOrFail({ where: { id: saleId, userId } });
        } catch (error) {
            res.status(404).json({ message: `SalesId: ${saleId}  not found`, Errors: error });
        }

        outcome = Sale.validateItemsSale(items, saleId);

        //TODO: Ver si los errores que se pasan al cliente son error o errors
        if (outcome.errors.length > 0) {
            return res.status(400).json({ message: 'Error to validate new sales. Not changes', errors });
        }

        // Add only items is not in BBDD and remove if not in list
        let toSave: ItemSale[] = outcome.items;
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

        try {            
            if (toDrop) await itemsRepository.remove(toDrop);
            if (toSave.length == 0) await salesRepository.remove(sale);
            else if (creditCard) {
                sale.creditCard = creditCard;
                await salesRepository.save(sale);
            }
        } catch (error) {
            res.status(400).json({ message: 'Error to update sales or remove old sales', Errors: error });
        }

        // save new sales
        try {
            await itemsRepository.save(toSave);
            res.json({ message: 'saved sales', salesId: saleId })
        } catch (error) {
            res.status(400).json({ message: 'Error to save new sales after drop old sales', error });
        }


    }

    static getSale = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sale);
        const itemsRepository = getRepository(ItemSale);
        const { id } = req.params;
        const userId = res.locals.jwtPayload.userId;
        let sale: Sale;

        try {
            sale = await salesRepository.findOneOrFail({ where: { id, userId } });
            console.log("Las sales son", sale);
        } catch (error) {
            res.status(404).json({ message: 'Sale not found' });
        }

        try {
            sale.itemsSale = await itemsRepository.find({ relations: ["product"], where: { sale: sale } });
            res.send(sale);
        } catch (error) {
            res.status(404).json({ message: 'Sales not found' });
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
            console.log("Estas son las sales por fecha", sale)
            res.send(sale);
        }
        catch (error) {
            res.status(400).json({ error });
        }

    }

}

export default SalesController;