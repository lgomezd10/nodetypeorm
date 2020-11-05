import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Min } from "class-validator";
import { User } from "./User";
import { Purchase } from "./Purchase";
import { Sale } from "./Sale";
import { ItemSale } from "./ItemSale";

@Entity()
@Unique(['name', 'userId'])
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @MinLength(4)
    name: string;

    @Column({type: "float", unsigned: true})
    @IsNotEmpty()
    @Min(0.01)
    price: number;

    @Column()
    type: string;

    @Column({default: 0})   
    stock: number;

    @Column("int")
    userId: number;

    @ManyToOne( type => User, user => user.products)
    @JoinColumn({ name: "userId" })
    user: User;

    @OneToMany(type => Purchase, purchase => purchase.product)
    purchases: Purchase[];

    @OneToMany(type => ItemSale, itemSale => itemSale.product)
    itemsSale: ItemSale[];

}