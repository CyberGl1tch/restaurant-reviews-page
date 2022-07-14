import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import {Roles} from "../Enums/Roles";
import {User} from "./User.entity";
import {StoreCategories} from "../Enums/StoreCategories";
import {Reviews} from "./Reviews.entity";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
    userId: number;

    @Column({type: "int"})
    reviewId: number;

    @Column()
    reason: string;

    @ManyToOne(() => Reviews,review => review.reports,{ onDelete: 'CASCADE' })
    review: Reviews

    @ManyToOne(() => User,user => user.reports,{ onDelete: 'CASCADE' })
    user: User


}