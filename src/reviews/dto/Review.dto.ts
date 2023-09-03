import {IsEmail, IsInt, IsNotEmpty, MinLength} from "class-validator";

export class ReviewDto {
    @IsNotEmpty()
    foodStars: number;

    @IsNotEmpty()
    starsService: number;

    @IsNotEmpty()
    starsHygiene: number;

    @IsNotEmpty()
    starsPrice: number;

    review?: string;

    image?: string
}
