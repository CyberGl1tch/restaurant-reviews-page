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
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {UpdateReviewDto} from "./dto/updateReview.dto";

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
        return {
            statusCode: 200,
            message: "Review submitted Successfully",
            review: review
        }
    }

    @Get(':restaurantId/all')
    getRestaurantReviews(@Param('restaurantId') restaurantId: number) {
        return this.reviewsService.getAllRestaurantReviews(restaurantId)
    }

    
    @Get(':id/allUserReviews')
    getAllReviews(@Param('id') userId: number) {
        return this.reviewsService.getAllReviews(userId)
    }


    @Get(':id')
    async get(@Param('id') id: number) {
        let review = await this.reviewsService.getReview(id)
        if(!review){
            throw new HttpException("Review Not Found", HttpStatus.NOT_FOUND)
        }
        return review
    }


    @UsePipes(ValidationPipe)
    @Patch('/update/:id')
    async update(@GetUserIDFromSession() userId: number,@GetUserRoleFromSession() role: Roles,@Param('id') reviewId: number, @Body() updateReviewDto: UpdateReviewDto) {
        let updateReview = await this.reviewsService.updateReview(userId,reviewId, role, updateReviewDto)
        if(!updateReview || updateReview["error"]){
            throw new HttpException(`${updateReview["error"] ? updateReview["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("Review updated Successfully", HttpStatus.OK)
    }


    @Delete(':id')
    async delete(@Param('id') id: number,@GetUserIDFromSession() userId: number, @GetUserRoleFromSession() role: Roles) {
        let review = await this.reviewsService.deleteReview(id,userId,role)
        if(!review || review["error"]){
            throw new HttpException(`${review["error"] ? review["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("Review deleted Successfully", HttpStatus.OK)
    }
}
