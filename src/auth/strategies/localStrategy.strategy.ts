import { PassportStrategy } from '@nestjs/passport';
import {Strategy } from 'passport-local'
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersService} from "../../users/users.service";
import {AuthService} from "../auth.service";
import {LocalUserDto} from "../dto/userDto.dto";

@Injectable()
export class LocalStrategyStrategy extends PassportStrategy(Strategy,'local'){
    constructor(
        private readonly authService : AuthService,

    ) {
        super({
            usernameField: "email"
        });
    }

    async validate(email: string, password: string): Promise<LocalUserDto>{
        const user = await this.authService.validateUser(email,password)
        if(!user){
            throw new HttpException("Unauthorized. Email or password is incorrect",HttpStatus.UNAUTHORIZED)
        }
        return user
    }
}