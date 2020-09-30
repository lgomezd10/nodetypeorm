import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Min } from "class-validator";
import { User } from "./User";
import { Product } from "./Product";
import { Sales } from "./Sales";

@Entity()
export class Sale {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "float", unsigned: true})
    @Min(0.01)
    quantity: number;

    @Column({type: "float", unsigned: true})
    @Min(0.01)
    price: number;

    @Column("int", { nullable: true })
    salesId: number;

    @ManyToOne( type => Sales, sales => sales.sale)
    @JoinColumn({ name: "salesId" })
    sales: Sales;

    @Column("int", { nullable: true })
    productId: number;

    @ManyToOne( type => Product, product => product.sale)
    @JoinColumn({ name: "productId" })
    product: Product;

    
}