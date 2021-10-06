import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Min, ValidateNested } from "class-validator";
import { User } from "./User";
import { Product } from "./Product";
import { Sale } from "./Sale";

@Entity()
export class ItemSale {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "float", unsigned: true})
    @Min(0.01)
    quantity: number;

    @Column({type: "float", unsigned: true})
    @Min(0.01)
    price: number;

    @Column("int", { nullable: true })
    saleId: number;

    @ManyToOne( type => Sale, sale => sale.itemsSale)
    @JoinColumn({ name: "saleId" })
    sale: Sale;

    @Column("int", { nullable: true })
    productId: number;

    @ManyToOne( type => Product, product => product.itemsSale)
    @JoinColumn({ name: "productId" })
    product: Product;

    equal(item: ItemSale): boolean {

       let  productIdItem = item.productId || item.product.id;
       let productId = this.productId || this.product.id;

        return  (productId == productIdItem) && (this.price == item.price) && (this.quantity == item.quantity);
        
    }
    
}