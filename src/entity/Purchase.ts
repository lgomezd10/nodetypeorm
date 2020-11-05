import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Min } from "class-validator";
import { User } from "./User";
import { Product } from "./Product";
import { Supplier } from "./Supplier";

@Entity()
export class Purchase {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("int", { nullable: true })
    productId: number;

    @ManyToOne( type => Product, product => product.purchases)
    @JoinColumn({ name: "productId" })
    product: Product;

    @Column({type: "float", unsigned: true})
    @Min(0.01, {each: true})
    quantity: number;

    @Column({type: "float", unsigned: true})    
    @IsNotEmpty({each: true})
    @Min(0.01, {each: true})
    price: number;

    @Column()
    @CreateDateColumn({type: "datetime"})
    date: Date;

    @Column("int")
    userId: number;

    @ManyToOne( type => User, user => user.purchases)
    @JoinColumn({name: "userId"})
    user: User;

    @Column("int")
    supplierId: number;

    @ManyToOne( type => Supplier, supplier => supplier.purchases)
    @JoinColumn({name: "supplierId"})
    supplier: number;

}