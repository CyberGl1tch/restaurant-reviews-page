import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import {Roles} from "../Enums/Roles";
import {User} from "./User.entity";
import {StoreCategories} from "../Enums/StoreCategories";
import {Reviews} from "./Reviews.entity";

@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
    userId: number;

    @Column({
        unique: true
    })
    address: string;

    @Column()
    image_url: string;

    @Column()
    phone: string;

    @Column({
        type: "enum",
        enum: StoreCategories,
        default: StoreCategories.COFFEE
    })
    category: StoreCategories

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => User,user => user.restaurants,{ onDelete: 'CASCADE' })
    user: User

    @OneToMany(() => Reviews,review => review.restaurant)
    reviews: Reviews[]


}