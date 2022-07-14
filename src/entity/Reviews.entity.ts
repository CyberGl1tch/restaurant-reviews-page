import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import {Roles} from "../Enums/Roles";
import {User} from "./User.entity";
import {Restaurant} from "./Restaurant.entity";
import {Report} from "./Report.entity";

@Entity()
export class Reviews {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
    userId: number;

    @Column({type: "int"})
    restaurantId: number;

    @Column({type: "float"})
    foodStars: number;

    @Column({type: "float"})
    starsService: number;

    @Column({type: "float"})
    starsHygiene: number;

    @Column({type: "float"})
    starsPrice: number;

    @Column()
    review: string;

    @ManyToOne(() => User,user => user.reviews,{ onDelete: 'CASCADE' })
    user: User

    @ManyToOne(() => Restaurant,restaurant => restaurant.reviews,{ onDelete: 'CASCADE' })
    restaurant: Restaurant

    @OneToMany(() => Report, report => report.review)
    reports: Report[]


}