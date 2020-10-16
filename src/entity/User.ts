import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Unique} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail } from "class-validator";
import { Product } from "./Product";
import { Sales } from "./Sales";
import { Purchases } from "./Purchases";

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
    product: Product[];

    @OneToMany(type => Sales, sales => sales.user)
    sales: Sales[];

    @OneToMany(type => Purchases, purchases => purchases.user)
    purchases: Purchases[];

}
