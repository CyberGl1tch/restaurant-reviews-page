import {forwardRef, HttpException, HttpStatus, Inject, Injectable, UsePipes, ValidationPipe} from '@nestjs/common';
import { CreateLoginUserDto } from './dto/create-login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entity/User.entity';
import {In, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthService} from "../auth/auth.service";
import {GetUserIDFromSession} from "../common/decorators/extract-user-from-session.decorator";
import {GetUserRoleFromSession} from "../common/decorators/extract-user-role-from-session.decorator";
import {Roles} from "../Enums/Roles";
import crypto from "crypto";
import {Restaurant} from "../entity/Restaurant.entity";
import {LocationDto} from "./dto/location.dto";
import {calculateDistanceBetweenPoints} from "../GoogleUtils/calculateDistanceBetweenPoints";

@Injectable()
export class UsersService {
  private error : String = null

  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,

      @InjectRepository(Restaurant)
      private restaurantRepository: Repository<Restaurant>,
      @Inject(forwardRef(() => AuthService))
      private authService: AuthService
  ) {}

  @UsePipes(ValidationPipe)
  async createUser(user: CreateLoginUserDto) {
    this.error = null
    const findUser = await this.usersRepository
        .createQueryBuilder("user")
        .where("user.email = :email", {email: user.email})
        .getOne()
    if(findUser) return null
    user = await this.usersRepository.create(user)
    let createdUser = await this.usersRepository.save(user)
    return this.authService.getTokens(createdUser.id,createdUser.email,createdUser.role)
  }

  async getUser(id: number) {
    const user =  await this.usersRepository
      .createQueryBuilder("user")
      .where("user.id = :userId", {userId: id})
      .getOne()
    return user

  }

  async getNearbyRestaurantsBasedOnLocation(location: LocationDto){
    let allRestaurants = await this.restaurantRepository.find()
    let nearbyRestaurants : Restaurant[] = null

    allRestaurants.forEach(restaurant=>{
      if(calculateDistanceBetweenPoints(location,{lat: restaurant.lat,long:restaurant.long}) < 5){
        nearbyRestaurants.push(restaurant)
      }
    })

    return nearbyRestaurants
  }

  async getUserSuggestedRestaurant(userId: number) {
    let userCommentedRestaurants: User = await this.usersRepository.findOne({
      where:{
        id: userId
      },
      relations:{
        reviews: {
          restaurant: true,
        }
      }
    })

    let tags: string[] = []
    userCommentedRestaurants.reviews.forEach(review =>{
      tags.push(review.restaurant.category)
    })


    return await  this.restaurantRepository.find({
        where:{
          category: In(tags)
        }
      })

  }

  getUserByEmail(email: string) {
    const user =  this.usersRepository
        .createQueryBuilder("user")
        .where("user.email = :email", {email: email})
        .getOne()
    return user

  }

  async getUsers() {
    this.error = null
    const users =  await this.usersRepository
      .createQueryBuilder("user")
      .getMany()
    if(!users) return {
      error: this.error ? this.error: "Cannot fetch any user"
    }
    return users.map(user =>{
      delete user.password
      return user
    })
  }

  async updateUser(userId: number, role: Roles,updateUserDto: UpdateUserDto) {
    this.error = null
    const user = await this.getUser(userId).catch(e=> this.error = e.message).catch(e=> this.error = e.message)
    if(!user) return {
      error: this.error ? this.error: "User not Found"
    }
    if((role && role !== Roles.ADMIN) && user.id !== userId){
      return {
        error: this.error ? this.error: "You are not permitted to update this user"
      }
    }
    if(updateUserDto.password && !updateUserDto.oldPassword) {
      return {
        error: this.error ? this.error: "Old password is required"
      }
    }else if(updateUserDto.password && updateUserDto.oldPassword){
      const oldPasswordHash = crypto.createHash('sha256').update(updateUserDto.oldPassword).digest('base64');
      if(oldPasswordHash === user.password){
        updateUserDto.password = crypto.createHash('sha256').update(updateUserDto.password).digest('base64');
      }else{
        return {
          error: this.error ? this.error: "Old password is incorrect"
        }
      }
    }
    delete updateUserDto?.oldPassword
    let updatedUser = await this.usersRepository.update({id: userId},updateUserDto as CreateLoginUserDto).catch(e=> this.error = e.message)
    if(!updatedUser) return {
      error: this.error ? this.error: "User can not be updated"
    }
    return this.error ? {
      error: this.error ? this.error: "User can not be updated"
    }: updatedUser;
  }

  async deleteUser(userId: number, role: Roles,specificUserId: number) {
    this.error = null
    const user = await this.getUser(specificUserId ? specificUserId : userId).catch(e=> this.error = e.message)
    if(!user) return {
      error: this.error ? this.error: "User not Found"
    }
    console.log(userId)
    if(role !== Roles.ADMIN && (user.id !== userId && user.id !== specificUserId)){
      return {
        error: this.error ? this.error: "You are not permitted to delete this restaurant"
      }
    }
    let deletedUser = await this.usersRepository.delete(specificUserId? specificUserId : userId)
    if(!deletedUser) return {
      error: this.error ? this.error: "User not Found"
    }
    return deletedUser;
  }
}
