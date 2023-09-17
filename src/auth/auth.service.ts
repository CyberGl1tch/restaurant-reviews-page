import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { UsersService } from '../EndPoints/users/users.service';
import { GoogleUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { use } from 'passport';
import * as crypto from "crypto";
import {LocalUserDto} from "./dto/userDto.dto";
import {Roles} from "../Enums/Roles";

@Injectable()
export class AuthService {
  constructor(
      @Inject(forwardRef(() => UsersService))
      private userService : UsersService,
      private  jwtService: JwtService
  ) {
  }


 async localLogin(user: LocalUserDto): Promise<Tokens>{
     const tokens = await this.getTokens(user.id,user.email,user.role)
     return tokens
 }

  async singInApple(){

  }

  async logout(){
        //invalidate session from backend blacklist refresh token
  }

  async refreshToken(){

  }

  async getTokens(user_id: number, email: string, role: Roles): Promise<Tokens>{
    const [accessToken,refreshToken] = await Promise.all([
      this.jwtService.signAsync({
          user_id: user_id,
          email: email,
          role: role
        },{
          secret: process.env.JWT_AT_SECRET,
          expiresIn: 60*60*24
        }
      ),
      this.jwtService.signAsync({
          user_id: user_id,
          email: email,
          role: role
          },{
          secret: process.env.JWT_RT_SECRET,
          expiresIn: 60*60*24*7
        }
      )
    ]);


    return{
      access_token: accessToken,
      refresh_token: refreshToken
    }

  }

  async validateUser(email:string , password:string){
      const user = await this.userService.getUserByEmail(email)
      const passwordHash = crypto.createHash('sha256').update(password).digest('base64');

      if(user && user.password === passwordHash ){
          return user
      }
      return null
  }

}
