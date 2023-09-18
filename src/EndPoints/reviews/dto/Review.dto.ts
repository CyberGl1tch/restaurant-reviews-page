import {IsEmail, IsInt, IsNotEmpty, IsOptional, MinLength} from "class-validator";

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

    @IsOptional()
    image?: string
}
