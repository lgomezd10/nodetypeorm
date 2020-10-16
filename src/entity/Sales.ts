import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Min, validateSync } from "class-validator";
import { User } from "./User";
import { Sale } from "./Sale";

@Entity()
export class Sales {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @UpdateDateColumn()
    date: Date;

    //TODO: Comprobar que sea un TINYINT(1)
    @Column({ default: false })
    creditCard: boolean;

    @Column("int")
    userId: number;

    @ManyToOne( type => User, user => user.purchases)
    @JoinColumn({name: "userId"})
    user: User;

    @OneToMany(type => Sale, sale => sale.sales)
    sale: Sale[];

    static validateArray(sales, idsales?): any {
        let salesList = {
            sales: [],
            errors: []
        }
        sales.forEach(element => {
            let sale: Sale = new Sale();
            if (element.product) {
                sale.product = element.product;
            } else {
                sale.productId = element.productId;
            }
            sale.price = element.price;
            sale.quantity = element.quantity;
            sale.salesId = idsales || 0;
            //TODO: Crear un error si el stock es menor que la cantidad comprada
            const error = validateSync(sale);
            if (error.length > 0) {
                salesList.errors.push(error);
            }
            salesList.sales.push(sale);
        });
        console.log("La sales list", salesList);
        return salesList;
    }

}