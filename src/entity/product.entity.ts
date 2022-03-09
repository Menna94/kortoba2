import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()

export class Product{
    @PrimaryGeneratedColumn() id:number;
    @Column({unique:true}) title:string;
    @Column() price:number;
    @Column() shortDescription:string;
    @Column() imgURL:string;

    @ManyToOne(()=>User) 
    @JoinColumn({name: 'user_id'})
    user:User;
}