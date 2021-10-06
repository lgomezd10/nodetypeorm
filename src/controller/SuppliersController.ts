import { validate } from "class-validator";
import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Supplier } from "../entity/Supplier"

class SuppliersController {


    static getAll = async (req: Request, res: Response) => {
        const suppliersRepository = getRepository(Supplier);
        const { userId } = res.locals.jwtPayload;
        let suppliers: Supplier[];

        try {
            suppliers = await suppliersRepository.find({ where: { userId } });
        } catch (error) {
            return res.json({ message: 'Error to find suppliers', error })
        }

        res.send(suppliers);
    }

    static getOneSupplier = async (req: Request, res: Response) => {
        const suppliersRepository = getRepository(Supplier);
        const { id } = req.params;
        const { userId } = res.locals.jwtPayload;
        let supplier: Supplier;

        try {
            supplier = await suppliersRepository.findOneOrFail(id);
        } catch (error) {
            return res.json({ message: 'Supplier not found', error });
        }

        if (supplier.userId != userId) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.send(supplier);

    }

    static postNewSupplier = async (req: Request, res: Response) => {
        const suppliersRepository = getRepository(Supplier);
        const { name, address, phone, web} = req.body;
        let supplier = new Supplier();
        supplier.name = name;
        supplier.address = address || '';
        supplier.phone = phone || '';
        supplier.web = web || '';
        supplier.userId = res.locals.jwtPayload.userId;

        const errors = await validate(supplier);
        if(errors.length > 0) {
            return res.status(400).json({message: 'Error to validate supplier', error: errors});
        }    

        try {
            const saved = await suppliersRepository.save(supplier);
            res.json({message: 'Supplier saved', supplier: saved});
        } catch (error) {
            return res.status(400).json({message: 'Supplier not saved', error})
        }

    }

    static postUpdateSupplier = async (req: Request, res: Response) => { 
        const suppliersRepository = getRepository(Supplier);
        const { name, address, phone, web} = req.body;
        const { id } = req.params;
        const { userId } = res.locals.jwtPayload;
        let supplier: Supplier;

        try {
            supplier = await suppliersRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({message: 'Supplier not found', error});
        }

        if (supplier.userId != userId) {
            return res.status(404).json({message: 'Supplier not found'});
        }

        supplier.name = name;
        supplier.address = address || '';
        supplier.phone = phone || '';
        supplier.web = web || '';
        supplier.userId = res.locals.jwtPayload.userId;

        try {
            const saved = await suppliersRepository.save(supplier);
            res.json({message: 'Supplier saved', supplier: saved});
        } catch (error) {
            return res.status(404).json({message: 'Supplier not saved', error});
        }

     }


}

export default SuppliersController;