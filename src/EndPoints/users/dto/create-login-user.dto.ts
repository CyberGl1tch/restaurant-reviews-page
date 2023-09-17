import {IsEmail, IsNotEmpty, IsOptional, MinLength} from "class-validator";


export class CreateLoginUserDto {
    @IsEmail()
    @IsNotEmpty({message: "Email must be specified"})
    email: string;
    @MinLength(5)
    @IsNotEmpty({message: "Password must be specified"})
    password: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    icon: string
}
