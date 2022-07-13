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
import {Public} from "../common/decorators";
import {GetUserIDFromSession} from "../common/decorators/extract-user-from-session.decorator";
import {GetUserRoleFromSession} from "../common/decorators/extract-user-role-from-session.decorator";
import {Roles} from "../Enums/Roles";

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
        throw new HttpException("Restaurant created Successfully", HttpStatus.OK)
    }

    @Public()
    @Get('/sorted')
    async getAllRestaurantsSorted() {
        let restaurants = await this.restaurantService.getAllRestaurantsSortedByReviews()
        return restaurants
    }

    @Public()
    @Get(':id')
    get(@Param('id') id: number) {
        return this.restaurantService.getRestaurant(id)
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


/*    @Get()
    getAllUserReviews() {
        return this.usersService.getUsers()
    }*/

/*    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(id, updateUserDto)
    }*/

    @Delete(':id')
    async delete(@Param('id') id: number,@GetUserIDFromSession() userId: number, @GetUserRoleFromSession() role: Roles) {
        let restaurant = await this.restaurantService.deleteRestaurant(id,userId,role)
        if(!restaurant || restaurant["error"]){
            throw new HttpException(`${restaurant["error"] ? restaurant["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("Restaurant deleted Successfully", HttpStatus.OK)
    }

}
