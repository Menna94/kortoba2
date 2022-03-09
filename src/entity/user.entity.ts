import { Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity()

export class User{
    @PrimaryGeneratedColumn() id:number;
    @Column() name:string;
    @Column({unique:true}) email:string;
    @Column() password:string;

    @ManyToOne(()=>Role) 
    @JoinColumn({name: 'role_id'})
    role:Role;

    
}