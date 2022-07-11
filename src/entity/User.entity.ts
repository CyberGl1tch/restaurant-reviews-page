import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert} from 'typeorm';
import {Roles} from "../Enums/Roles";
import {Reviews} from "./Reviews.entity";

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
    nullable: false
  })
  password: string;

  @Column({
    type: "enum",
    enum: Roles,
    default: Roles.USER
  })
  role: Roles

  @Column({type: "date"})
  registeredDate: Date;

  @Column({type: "date"})
  latestLogin: Date;

  @OneToMany(() => Reviews, review => review.user)
  profiles: Reviews[]

  @BeforeInsert()
  async registerDate(){
    this.registeredDate = new Date()
  }

}