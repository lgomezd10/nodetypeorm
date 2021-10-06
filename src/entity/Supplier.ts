import { IsNotEmpty, MinLength } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Purchase } from "./Purchase";
import { User } from "./User";

@Entity()
export class Supplier {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @MinLength(4)
    name: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    web: string;

    @Column("int")
    userId: number;

    @ManyToOne( type => User, user => user.suppliers)
    @JoinColumn({name: "userId"})
    user: User;

    @OneToMany( type => Purchase, purchase => purchase.supplier)
    purchases: Purchase[];

}