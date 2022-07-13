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
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './dto/Review.dto';
import {Public} from "../common/decorators";
import {GetUserIDFromSession} from "../common/decorators/extract-user-from-session.decorator";
import {GetUserRoleFromSession} from "../common/decorators/extract-user-role-from-session.decorator";
import {Roles} from "../Enums/Roles";

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Public()
    @Post(":restaurantId/create")
    @UsePipes(ValidationPipe)
    async create(@Body() reviewDto: ReviewDto,@Param('restaurantId') restaurantId: number, @GetUserIDFromSession() userId: number) {

        let review = await this.reviewsService.createReview(reviewDto,restaurantId,userId)
        console.log(review)
        if(!review || review["error"]){
            throw new HttpException(`${review["error"] ? review["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("Review submitted Successfully", HttpStatus.OK)
    }

    @Get(':restaurantId/all')
    getRestaurantReviews(@Param('restaurantId') restaurantId: number) {
        return this.reviewsService.getAllReviews(restaurantId)
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        let review = await this.reviewsService.getReview(id)
        if(!review){
            throw new HttpException("Review Not Found", HttpStatus.NOT_FOUND)
        }
        return review
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
    async delete(@Param('id') id: string,@GetUserIDFromSession() userId: number, @GetUserRoleFromSession() role: Roles) {
        let review = await this.reviewsService.deleteReview(id,userId,role)
        if(!review || review["error"]){
            throw new HttpException(`${review["error"] ? review["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("Review deleted Successfully", HttpStatus.OK)
    }
}
