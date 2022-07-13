import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Roles} from "../Enums/Roles";
import {User} from "./User.entity";
import {Restaurant} from "./Restaurant.entity";

@Entity()
export class Reviews {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
    userId: number;

    @Column({type: "int"})
    restaurantId: number;

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

    @ManyToOne(() => User,user => user.reviews,{ onDelete: 'CASCADE' })
    user: User

    @ManyToOne(() => Restaurant,restaurant => restaurant.reviews,{ onDelete: 'CASCADE' })
    restaurant: Restaurant


}