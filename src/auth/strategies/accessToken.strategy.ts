import { PassportStrategy } from '@nestjs/passport';
import {Strategy,ExtractJwt } from 'passport-jwt'
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy,'jwt'){
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_AT_SECRET
    });
  }

  validate(payload: any){
    return payload
  }
}