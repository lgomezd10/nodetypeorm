import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Min } from "class-validator";
import { User } from "./User";
import { Product } from "./Product";
import { Supplier } from "./Supplier";

@Entity()
export class Purchase {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("int", { nullable: false })
    productId: number;

    @ManyToOne( type => Product, product => product.purchases)
    @JoinColumn({ name: "productId" })
    product: Product;

    @Column({type: "float", unsigned: true})
    @IsNotEmpty()
    @Min(0.01)
    quantity: number;

    @Column({type: "float", unsigned: true})    
    @IsNotEmpty()
    @Min(0.01)
    price: number;

    @Column()
    @CreateDateColumn({type: "datetime"})
    date: Date;

    @Column("int")
    userId: number;

    @ManyToOne( type => User, user => user.purchases)
    @JoinColumn({name: "userId"})
    user: User;

    @Column("int", { nullable: true })
    supplierId: number;

    @ManyToOne( type => Supplier, supplier => supplier.purchases)
    @JoinColumn({name: "supplierId"})
    supplier: Supplier;

}