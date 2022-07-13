import {forwardRef, HttpException, HttpStatus, Inject, Injectable, UsePipes, ValidationPipe} from '@nestjs/common';
import { ReviewDto } from './dto/Review.dto';
import { User } from '../entity/User.entity';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Reviews} from "../entity/Reviews.entity";
import {Restaurant} from "../entity/Restaurant.entity";
import {RestaurantService} from "../restaurant/restaurant.service";
import {Public} from "../common/decorators";
import {UsersService} from "../users/users.service";
import {Roles} from "../Enums/Roles";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class ReviewsService {
  private error: string = null
  constructor(
      @InjectRepository(Reviews)
      private reviewsRepository: Repository<Reviews>,

      @Inject(forwardRef(() => UsersService))
      private userService: UsersService,
      private restaurantService: RestaurantService
  ) {}

  @Public()
  @UsePipes(ValidationPipe)
  async createReview(reviewDto: ReviewDto, restaurantId: number,userId: number) {
    this.error = null
    let user = await this.userService.getUser(userId).catch(e=> this.error = e.message)
    if(!user) return {
      error: this.error ? this.error: "User not Found"
    }
    let restaurant = await this.restaurantService.getRestaurant(restaurantId).catch(e=> this.error = e.message)
    if(!restaurant) return {
      error: this.error ? this.error: "Restaurant not Found"
    }
    let review = await this.reviewsRepository.create(reviewDto)
    review.restaurant = restaurant
    review.user = user

    if(!review) return {
      error: this.error ? this.error: "Review can not be submitted"
    }
    await this.reviewsRepository.save(review).catch(e=> this.error = e.message)
    if(this.error) return {
      error: this.error
    }
    return review
  }

  getReview(id: string): Promise<Reviews> {
    this.error = null

    const review =  this.reviewsRepository
      .createQueryBuilder("review")
      .where("review.id = :reviewId", {reviewId: id})
      .getOne()
    return review

  }
  getAllReviews(restaurantId: number) {
    this.error = null

    const restaurants = this.reviewsRepository
        .createQueryBuilder("review")
        .where("review.restaurantId = :restaurantId", {restaurantId: restaurantId})
        .getMany()

    return restaurants
  }


  updateReview(id: string, updateUserDto: ReviewDto) {
    this.error = null

    return `This action updates a #${id} user`;
  }

  async deleteReview(id: string,userId: number,role : Roles) {
    this.error = null

    const review = await this.getReview(id).catch(e=> this.error = e.message)
    if(!review) return {
      error: this.error ? this.error: "Review not Found"
    }
    console.log(role)
    if(role !== Roles.ADMIN && review.userId !== userId){
      return {
        error: this.error ? this.error: "You are not permitted to delete this review"
      }
    }
    let deletedReview = await this.reviewsRepository.delete(id).catch(e=> this.error = e.message)
    if(!deletedReview) return {
      error: this.error ? this.error: "Review not Found"
    }
    return deletedReview;
  }
}
