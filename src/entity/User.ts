import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail } from "class-validator";
import { Product } from "./Product";
import { Sales } from "./Sales";
import { Purchases } from "./Purchases";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    user: string;

    @Column()
    name: string;

    @Column()
    @CreateDateColumn()
    createAt: Date;

    @Column()
    birthday: Date;

    @OneToMany(type => Product, product => product.user)
    product: Product[];

    @OneToMany(type => Sales, sales => sales.user)
    sales: Sales[];

    @OneToMany(type => Purchases, purchases => purchases.user)
    purchases: Purchases[];

}
