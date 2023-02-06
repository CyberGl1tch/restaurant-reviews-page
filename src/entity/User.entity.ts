import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, AfterInsert} from 'typeorm';
import {Roles} from "../Enums/Roles";
import {Reviews} from "./Reviews.entity";
import crypto from "crypto";
import {Restaurant} from "./Restaurant.entity";
import {Report} from "./Report.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    nullable: false,
    unique: false
  })
  firstName: string;

  @Column({
    nullable: false,
    unique: false
  })
  lastName: string;

  @Column({
    nullable: true,
    unique: false,
    type: "long"
  })
  long: number

  @Column({
    nullable: true,
    unique: false,
    type: "long"
  })
  lat: number

  @Column({
    nullable: false
  })
  password: string;

  @Column({
    type: "enum",
    enum: Roles,
    default: Roles.USER
  })
  role: Roles

  @Column({
    nullable: true,
    unique: false
  })
  icon: string;

  @Column({type: "date"})
  registeredDate: Date;

  @Column({type: "date"})
  latestLogin: Date;

  @OneToMany(() => Reviews, review => review.user)
  reviews: Reviews[]

  @OneToMany(() => Restaurant, restaurant => restaurant.user)
  restaurants: Restaurant[]

  @OneToMany(() => Report, report => report.user)
  reports: Report[]

  @BeforeInsert()
  async registerDate(){
    this.registeredDate = new Date()
  }

  @BeforeInsert()
  async hashPassword(){
    this.password = crypto.createHash('sha256').update(this.password).digest('base64');
  }

  @AfterInsert()
  async updateLatestLogin(){
    this.latestLogin = new Date()
  }
}