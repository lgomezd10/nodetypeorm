import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entity/Product";


class ProductsController {
    static getAllProduct = async (req: Request, res: Response) => {
        let products: Product[];
        const productsRepository = getRepository(Product);

        try {
            products = await productsRepository.find();
        } catch (error) {
            res.status(404).json({ message: 'Something goes wrong!', error });
        }

        if (products.length > 0) {
            res.send(products);
        } else {
            res.status(404).json({ message: 'Not result' });
        }
    }
    static getOneProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        const productsRepository = getRepository(Product);

        try {
            const product = await productsRepository.findOneOrFail(id);
            res.send(product);
        } catch (error) {
            res.status(404).json({ message: 'Product not found', error });
        }

    }
    static postNewProduct = async (req: Request, res: Response) => { 
        const productsRepository = getRepository(Product);
        const { name, price, type } = req.body;
        let product: Product = new Product();

        product.name = name;
        product.price = price;
        product.type = type;

        
        const errors = await validate(product);
        if(errors.length > 0) {
            return res.status(400).json({message: 'Error to validate product', errors});
        }    

        try {
            await productsRepository.save(product);            
            
            res.json({message: 'product saved'});           
            
        } catch (error) {
            res.status(400).json({message: 'product already exists', error});
        }

        let products = await productsRepository.find();
        const socket =require('../index');
        socket.emit('updateProducts', products);

       
    }
    static postUpdateProduct = async (req: Request, res: Response) => { 
        let product: Product
        const productsRepository = getRepository(Product);
        const { id } = req.params;
        const { name, price, type } = req.body;

        try {
            product = await productsRepository.findOneOrFail(id);
            product.name = name;
            product.price = price;
            product.type = type;
        } catch (error) {
            res.status(400).json({message:'Product not found'});
        }

        const errors = await validate(product);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        try {
            await productsRepository.save(product);
            res.send(product);
        } catch (error) {
            res.status(409).json({error});
        }

        let products = await productsRepository.find();
        const socket =require('../index');
        socket.emit('updateProducts', products);


    }

    static deleteProduct = async (req: Request, res: Response) => { 
        const { id } = req.params;
        let product: Product;
        const productsRepository = getRepository(Product);

        try {
            product = await productsRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).json({ message: 'Product not found', error });
        }

        productsRepository.delete(id);
        res.json({message: 'Product deleted'})

    }

}

export default ProductsController;