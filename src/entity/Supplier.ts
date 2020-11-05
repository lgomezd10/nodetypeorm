import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Purchase } from "./Purchase";
import { User } from "./User";

@Entity()
export class Supplier {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phone: number;

    @Column()
    web: string;

    @Column("int")
    userId: number;

    @ManyToOne( type => User, user => user.purchases)
    @JoinColumn({name: "userId"})
    user: User;

    @OneToMany( type => Purchase, purchase => purchase.supplier)
    purchases: Purchase[];

}