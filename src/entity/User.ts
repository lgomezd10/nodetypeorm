import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Unique} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail } from "class-validator";
import { Product } from "./Product";
import { Sale } from "./Sale";
import { Purchase } from "./Purchase";
import SuppliersController from "../controller/SuppliersController";
import { Supplier } from "./Supplier";

@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(4)
    //@IsEmail()
    @IsNotEmpty()
    username: string;

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createAt: Date;

    @OneToMany(type => Product, product => product.user)
    products: Product[];

    @OneToMany(type => Sale, sales => sales.user)
    sales: Sale[];

    @OneToMany(type => Purchase, purchase => purchase.user)
    purchases: Purchase[];

    @OneToMany(type => Supplier, supplier => supplier.user)
    suppliers: Supplier[];

}
