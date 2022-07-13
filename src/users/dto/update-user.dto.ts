import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginUserDto } from './create-login-user.dto';
import {IsNotEmpty, MinLength} from "class-validator";

export class UpdateUserDto extends PartialType(CreateLoginUserDto) {

    @MinLength(5)
    oldPassword?: string;

}
