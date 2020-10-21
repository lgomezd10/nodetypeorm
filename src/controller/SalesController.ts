import { validateSync } from "class-validator";
import { Request, Response } from "express";
import { Between, getRepository } from "typeorm";
import { Product } from "../entity/Product";
import { Sale } from "../entity/Sale";
import { Sales } from "../entity/Sales";

class SalesController {

    static postSales = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sales);
        const saleRepository = getRepository(Sale);
        let sales = new Sales();
        let saved: Sales;
        let arraySales = req.body.sale;
        sales.creditCard = req.body.crediCard;
        sales.userId = res.locals.jwtPayload.userId;
        
        if (!(arraySales && (arraySales.length > 0))) {
            return res.status(400).json({ message: 'there arent sales to save' });
        }

        const salida = Sales.validateArray(arraySales);

        if (salida.errors.length > 0) {
            return res.status(400).json({ message: 'Error to validate sales. Saved Nothing', errors: salida.errors });
        }


        try {
            saved = await salesRepository.save(sales);
        } catch (error) {
            res.status(400).json({ message: 'Error to save sales', error });
        }

        salida.sales.forEach(element => {
            element.sales = saved;
        });

        try {
            await saleRepository.save(salida.sales);
            res.json({ message: 'saved sales' , salesId: saved.id})
            
        } catch (error) {
            await salesRepository.delete(saved);
            res.status(400).json({ message: 'Errors saving sales. Deleted sales', errors: error });
        }
        
    }

    static postUpdateSales = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sales);
        const saleRepository = getRepository(Sale);
        let errors = [];
        const { creditCard } = req.body;
        const salesId: any = req.params.id;
        const userId = res.locals.jwtPayload.userId;
        let sales: Sales;
        let arraySales = req.body.sales;
        let arraySaved;
        let toDrop: Sale[];


        if (!(arraySales && (arraySales.length > 0))) {
            return res.status(400).json({ message: 'there arent sales to save' });
        }

        try {
            sales = await salesRepository.findOneOrFail({where: {id: salesId, userId}});
        } catch (error) {
            res.status(404).json({ message: `SalesId: ${salesId}  not found`, Errors: error });
        }

        arraySaved = Sales.validateArray(arraySales, salesId);


        if (arraySaved.errors.length > 0) {
            return res.status(400).json({ message: 'Error to validate new sales. Not changes', errors });
        }


        // remove all sale with idSales
        try {
            if (creditCard) {
                sales.creditCard = creditCard;
                await salesRepository.save(sales);
            }
            toDrop = await saleRepository.find({ where: { sales: sales } });
            await saleRepository.remove(toDrop);
        } catch (error) {
            res.status(400).json({ message: 'Error to update sales or remove old sales', Errors: error });
        }

        // save new sales
        try {
            await saleRepository.save(arraySaved.sales);
            res.json({ message: 'saved sales', salesId })
        } catch (error) {
            res.status(400).json({ message: 'Error to save new sales after drop old sales', errors: error });
        }


    }

    static getSale = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sales);
        const saleRepository = getRepository(Sale);
        const { id } = req.params;
        const userId = res.locals.jwtPayload.userId;
        console.log("El id es", id);
        let sales;
        let salesList;

        try {
            sales = await salesRepository.findOneOrFail({where: {id, userId}});
            console.log("Las sales son", sales);
        } catch (error) {
            res.status(404).json({ message: 'Sale not found' });
        }

        try {
            salesList = await saleRepository.find({ relations: ["product"], where: {sales} });
            sales.sale = salesList;
            res.send(sales);
        } catch (error) {
            res.status(404).json({ message: 'Sales not found' });
        }


    }

    static postSalesByDate = async (req: Request, res: Response) => {
        const salesRepository = getRepository(Sales);
        const saleRepository = getRepository(Sale);
        const { from, to } = req.body;
        const userId = res.locals.jwtPayload.userId;
        let sales;
        let response = [];
        if (!(req.body.from && req.body.to)) {
            return res.status(400).json({ message: 'from and to required' })
        }

        try {           

            sales = await salesRepository.find({relations: ["sale"], where: {date: Between(from, to), userId}});
            console.log("Estas son las sales por fecha", sales)        
            res.send(sales);
        }
        catch (e) {
            res.status(400).json({ errors: e });
        }
       
    }

}

export default SalesController;