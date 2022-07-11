import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GoogleUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private userService : UsersService,
    private  jwtService: JwtService
  ) {
  }

 async singInGoogle(user : GoogleUserDto){
  //todo Create or find User in Db
   let id = 1
   console.log(user)
   const tokens = await this.getTokens(id,user.email)
   console.log(tokens)
   return tokens
 }

  async singInApple(){

  }

  async logout(){

  }

  async refreshToken(){

  }

  async getTokens(user_id: number, email: string): Promise<Tokens>{
    const [accessToken,refreshToken] = await Promise.all([
      this.jwtService.signAsync({
          user_id: user_id,
          email: email
        },{
          secret: process.env.JWT_AT_SECRET,
          expiresIn: 60*60*24
        }
      ),
      this.jwtService.signAsync({
          user_id: user_id,
          email: email
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

}
