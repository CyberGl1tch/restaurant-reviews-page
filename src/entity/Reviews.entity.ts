import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Roles} from "../Enums/Roles";
import {User} from "./User.entity";

@Entity()
export class Reviews {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
    userId: number;

    @Column({type: "int"})
    foodStars: number;

    @Column({type: "int"})
    starsService: number;

    @Column({type: "int"})
    starsHygiene: number;

    @Column({type: "int"})
    starsPrice: number;

    @Column()
    review: string;

    @ManyToOne(() => User,user => user.profiles)
    user: User


}