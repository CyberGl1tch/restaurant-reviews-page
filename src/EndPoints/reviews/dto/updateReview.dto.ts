import {PartialType} from "@nestjs/mapped-types";
import {CreateLoginUserDto} from "../../users/dto/create-login-user.dto";
import {MinLength} from "class-validator";
import {ReviewDto} from "./Review.dto";

export class UpdateReviewDto extends PartialType(ReviewDto) {


}
