import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Min, validateSync } from "class-validator";
import { User } from "./User";
import { ItemSale } from "./ItemSale";

@Entity()
export class Sale {

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

    @OneToMany(type => ItemSale, itemSale => itemSale.sale)
    itemsSale: ItemSale[];

    static validateItemsSale(itemsSale: ItemSale[], idSale?:number): any {
        let itemsList = {
            items: [],
            errors: []
        }
        const validateOptions = { validationError: { target: false, value: false } }

        try {
            itemsSale.forEach((element: ItemSale) => {
                let item: ItemSale = new ItemSale();
                if (element.product) {
                    item.product = element.product;
                } else {
                    item.productId = element.productId;
                }
                item.price = element.price;
                item.quantity = element.quantity;
                //TODO: Comprobar que al poner cero no da un error
                item.saleId = idSale || 0;
                //TODO: Crear un error si el stock es menor que la cantidad comprada
                const error = validateSync(item, validateOptions);
                if (error.length > 0) {
                    //itemsList.errors.push(error);
                    throw(error);
                } else {
                    itemsList.items.push(item);
                }
            });
            
        } catch (error) {
            itemsList.errors[0] = error;
        }
        
        return itemsList;
    }

}