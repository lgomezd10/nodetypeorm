import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entity/Product";


class ProductsController {
    static getAllProduct = async (req: Request, res: Response) => {
        let products: Product[];
        const productsRepository = getRepository(Product);
        const { auth } = req.headers;
        const { userId } = res.locals.jwtPayload;
        try {
            products = await productsRepository.find({ where: { userId } });
        } catch (error) {
            return res.status(406).json({ message: 'Something goes wrong!', error });
        }

        res.send(products);
    }
    static getOneProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        const productsRepository = getRepository(Product);
        const { userId } = res.locals.jwtPayload;
        let product: Product;

        try {
            product = await productsRepository.findOneOrFail(id);

        } catch (error) {
            return res.status(404).json({ message: 'Product not found', error });
        }

        if (product.userId != userId) {
            return res.status(404).json({ message: 'product not found' })
        }
        res.send(product);

    }


    
    static postNewProduct = async (req: Request, res: Response) => {
        const productsRepository = getRepository(Product);
        const { name, price, type } = req.body;
        const { userId } = res.locals.jwtPayload;
        let product: Product = new Product();

        product.name = name;
        product.price = price;
        product.type = type;
        product.userId = userId;


        const errors = await validate(product);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Error to validate product', errors });
        }

        try {
            let saved = await productsRepository.save(product);
            res.send(saved);

        } catch (error) {
            return res.status(400).json({ message: 'product already exists', error });
        }

        let products = await productsRepository.find({ where: { userId} });
        const socket = require('../index');
        socket.emit('updateProducts', products);

    }

    static postUpdateProduct = async (req: Request, res: Response) => {
        let product: Product
        const productsRepository = getRepository(Product);
        const { id } = req.params;
        const { name, price, type } = req.body;
        const { userId } = res.locals.jwtPayload;

        try {
            product = await productsRepository.findOneOrFail(id);

        } catch (error) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.userId != userId) {
            return res.status(404).json({ message: 'product not found' })
        }
        product.name = name || product.name;
        product.price = price || product.price;
        product.type = type || product.type;

        const errors = await validate(product);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        try {
            await productsRepository.save(product);
            res.send(product);
        } catch (error) {
            return res.status(409).json({ error });
        }

        let products = await productsRepository.find({ where: { userId } });
        const socket = require('../index');
        socket.emit('updateProducts', products);


    }

    static deleteProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        let product: Product;
        const productsRepository = getRepository(Product);
        const { jwtPayload } = res.locals;

        try {
            product = await productsRepository.findOneOrFail(id);
            if (product.userId != jwtPayload.userId) {
                return res.status(404).json({ message: 'product not found' })
            }
        } catch (error) {
            return res.status(404).json({ message: 'Product not found', error });
        }

        productsRepository.delete(id);
        res.json({ message: 'Product deleted' })

    }

}

export default ProductsController;