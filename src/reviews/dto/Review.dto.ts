import {IsEmail, IsInt, IsNotEmpty, MinLength} from "class-validator";

export class ReviewDto {
    @IsInt()
    @IsNotEmpty()
    foodStars: number;

    @IsInt()
    @IsNotEmpty()
    starsService: number;

    @IsInt()
    @IsNotEmpty()
    starsHygiene: number;

    @IsInt()
    @IsNotEmpty()
    starsPrice: number;

    review?: string;
}
