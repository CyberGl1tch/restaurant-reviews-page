import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginUserDto } from './create-login-user.dto';
import {IsNotEmpty, MinLength} from "class-validator";

export class LocationDto {

    @MinLength(1)
    @IsNotEmpty({message: "Longitude must be specified"})
    long: number;

    @MinLength(1)
    @IsNotEmpty({message: "Longitude must be specified"})
    lat: number;

}
