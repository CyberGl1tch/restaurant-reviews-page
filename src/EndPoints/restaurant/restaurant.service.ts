import {HttpException, HttpStatus, Injectable, UsePipes, ValidationPipe} from '@nestjs/common';
import { RestaurantDto } from './dto/Restaurant.dto';
import { User } from '../../entity/User.entity';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Reviews} from "../../entity/Reviews.entity";
import {Restaurant} from "../../entity/Restaurant.entity";
import {UsersService} from "../users/users.service";
import {Roles} from "../../Enums/Roles";
import {UpdateReviewDto} from "../reviews/dto/updateReview.dto";
import {UpdateRestaurantDto} from "./dto/UpdateRestaurant.dto";

@Injectable()
export class RestaurantService {
  private error : String = null
  constructor(
      @InjectRepository(Reviews)
      private reviewsRepository: Repository<Reviews>,
      private userService: UsersService,
      @InjectRepository(Restaurant)
      private restaurantRepository: Repository<Restaurant>,

  ) {}

  @UsePipes(ValidationPipe)
  async createRestaurant(restaurantDto: RestaurantDto, userId: number) {
    this.error = null

    let user = await this.userService.getUser(userId).catch(e=> this.error = e.message)
    if(!user) return {
      error: this.error ? this.error: "User not Found"
    }
    let restaurant = await this.restaurantRepository.create(restaurantDto)
    restaurant.user = user
    restaurant =  await this.restaurantRepository.save(restaurant).catch(e=> this.error = e.message)
    if(!restaurant) return {
      error: this.error ? this.error: "User not Found"
    }
    return restaurant
  }

  async getRestaurant(id: number) {
    this.error = null

    const restaurant =  await this.restaurantRepository
        .createQueryBuilder("restaurant")
        .leftJoinAndSelect("restaurant.reviews","reviews")
        .leftJoin("reviews.user","user")
        .addSelect(["user.firstName","user.lastName","user.icon"])
        .where("restaurant.id = :restaurantId", {restaurantId: id})
        .getOne()
    console.log(restaurant)
    return restaurant
  }

  searchRestaurant(searchString: string) {
    this.error = null

    const restaurant =  this.restaurantRepository
        .createQueryBuilder("restaurant")
        .where("restaurant.name like :name", { name:`%${searchString}%`})
        .getMany()
    return restaurant
  }

  getAllRestaurants() {
    this.error = null

    const restaurants =  this.restaurantRepository
        .createQueryBuilder("restaurant")
        .getMany()

    return restaurants
  }

  async getAllRestaurantsSortedByReviews() {
    this.error = null

    const restaurants =  await this.restaurantRepository
        .createQueryBuilder("restaurant")
        .innerJoin("restaurant.reviews","reviews")
        .addSelect("restaurant.*")
        .addSelect("COUNT(reviews.id)","totalReviews")
        .addSelect("(SUM(reviews.foodStars + reviews.starsService + reviews.starsHygiene + reviews.starsPrice)/COUNT(reviews.id))/4","totalStarsAvg")
        .groupBy("restaurant.id")
        .orderBy('totalStarsAvg', 'DESC')
        .getRawMany().catch(e=> this.error = e.message)
      if(!restaurants) return {
        error: this.error ? this.error: "User not Found"
      }
      //Cause this is a raw element format it right
    let all_restaurants = await this.getAllRestaurants()
    let restaurantsWithReviews = restaurants.map(restaurant => {
      Object.keys(restaurant).forEach(keyName=>{
        if(keyName.replace("restaurant_","") !== keyName ){
          restaurant[keyName.replace("restaurant_","")] = restaurant[keyName]
          delete restaurant[keyName]
        }
      })
      return restaurant
    })

    all_restaurants = all_restaurants.filter(restaurantObject => !restaurantsWithReviews.find(restaurantObjectWithReview=>restaurantObjectWithReview.id === restaurantObject.id))
    return [...restaurantsWithReviews,...all_restaurants]

  }



  async updateRestaurant(userId: number, restaurantId: number, role: Roles, updateRestaurantDto: UpdateRestaurantDto) {
    this.error = null
    const user = await this.userService.getUser(userId).catch(e=> this.error = e.message)
    if(!user) return {
      error: this.error ? this.error: "User not Found"
    }
    const restaurant = await this.getRestaurant(restaurantId).catch(e=> this.error = e.message)
    // const restaurantWithSameFields = await this.restaurantRepository.findOne({where:[{address: updateRestaurantDto.address},{name: updateRestaurant.name}]}).catch(e=> this.error = e.message)
    // if(restaurantWithSameFields){
    //
    //   return {
    //     error: this.error ? this.error: restaurantWithSameFields.address === updateRestaurantDto.address ? "Address is already in use" : "There is a restaurant with the same name"
    //   }
    // }
    if(!restaurant) return {
      error: this.error ? this.error: "Restaurant not Found"
    }
    if((role && role !== Roles.ADMIN) && user.id !== restaurant.userId){
      return {
        error: this.error ? this.error: "You are not permitted to update this user"
      }
    }

    let updatedRestaurant = await this.restaurantRepository.update({id: restaurantId},updateRestaurantDto).catch(e=> this.error = e.message)
    if(!updatedRestaurant) return {
      error: this.error ? this.error: "Restaurant can not be updated"
    }
    return this.error ? {
      error: this.error ? this.error: "Restaurant can not be updated"
    }: this.getRestaurant(restaurantId); //todo return object with update restaurant
  }

  async deleteRestaurant(id: number,userId: number,role : Roles) {
    this.error = null

    const restaurant = await this.getRestaurant(id).catch(e=> this.error = e.message)
    if(!restaurant) return {
      error: this.error ? this.error: "Restaurant not Found"
    }
    console.log(userId)
    if(role !== Roles.ADMIN && restaurant.userId !== userId){
      return {
        error: this.error ? this.error: "You are not permitted to delete this restaurant"
      }
    }
    let deletedRestaurant = await this.restaurantRepository.delete(id)
    if(!deletedRestaurant) return null
    return deletedRestaurant;
  }
}
