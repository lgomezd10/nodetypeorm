import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Min } from "class-validator";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Purchases {

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

    @ManyToOne( type => User, user => user.purchases)
    user: User;

}