import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    UsePipes,
    ValidationPipe,
    HttpException, HttpStatus
} from "@nestjs/common";
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './dto/Restaurant.dto';
import {Public} from "../../common/decorators";
import {GetUserIDFromSession} from "../../common/decorators/extract-user-from-session.decorator";
import {GetUserRoleFromSession} from "../../common/decorators/extract-user-role-from-session.decorator";
import {Roles} from "../../Enums/Roles";
import {UpdateReviewDto} from "../reviews/dto/updateReview.dto";
import {UpdateRestaurantDto} from "./dto/UpdateRestaurant.dto";

@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}


    @Post("/create")
    @UsePipes(ValidationPipe)
    async create(@Body() restaurantDto: RestaurantDto,@GetUserIDFromSession() userId: number) {
        let restaurant = await this.restaurantService.createRestaurant(restaurantDto,userId)
        if(!restaurant || restaurant["error"]){
            throw new HttpException(`${restaurant["error"] ? restaurant["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        return restaurant
    }

    @Public()
    @Get('/sorted')
    async getAllRestaurantsSorted() {
        let restaurants = await this.restaurantService.getAllRestaurantsSortedByReviews()
        return restaurants
    }

    @Public()
    @Get(':id')
    async get(@Param('id') id: number) {
        let restaurant = await this.restaurantService.getRestaurant(id)
        restaurant["totalStarsAvg"] = restaurant.reviews.map(review => (review.foodStars + review.starsService + review.starsHygiene + review.starsPrice)/4).reduce((partialSum, a) => partialSum + a, 0)/restaurant.reviews.length;
        return restaurant
    }

    @Public()
    @Get('')
    getAllRestaurants() {
        return this.restaurantService.getAllRestaurants()
    }

    @Get('/search/:searchString')
    async searchRestaurants(@Param('searchString') searchString: string) {
        return await this.restaurantService.searchRestaurant(searchString)
    }

    @UsePipes(ValidationPipe)
    @Patch('/update/:id')
    async update(@GetUserIDFromSession() userId: number,@GetUserRoleFromSession() role: Roles,@Param('id') restaurantId: number, @Body() updateRestaurantDto: UpdateRestaurantDto) {
        let updateRestaurant = await this.restaurantService.updateRestaurant(userId,restaurantId, role, updateRestaurantDto)
        if(!updateRestaurant || updateRestaurant["error"]){
            throw new HttpException(`${updateRestaurant["error"] ? updateRestaurant["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        return {
            statusCode: 200,
            message: "Restaurant updated Successfully",
            restaurant: updateRestaurant
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: number,@GetUserIDFromSession() userId: number, @GetUserRoleFromSession() role: Roles) {
        let restaurant = await this.restaurantService.deleteRestaurant(id,userId,role)
        if(!restaurant || restaurant["error"]){
            throw new HttpException(`${restaurant["error"] ? restaurant["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("Restaurant deleted Successfully", HttpStatus.OK)
    }

}
