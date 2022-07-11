import {IsEmail, IsNotEmpty} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({message: "Email must be specified"})
    email: string;
    @IsNotEmpty({message: "Password must be specified"})
    password: string;
}
