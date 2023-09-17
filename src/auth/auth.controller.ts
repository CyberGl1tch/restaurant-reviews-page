import {Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { AuthService } from './auth.service';
import {GoogleUserDto, LocalUserDto} from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { GetGoogleUser, Public } from '../common/decorators';
import { GoogleGuard } from '../common/guards/google.guard';
import {LocalGuard} from "../common/guards/local.guard";
import {Request} from "express";
import {GetLocalUser} from "../common/decorators/get-local-user.decorator";
import {CreateLoginUserDto} from "../EndPoints/users/dto/create-login-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {

  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('/google/callback')
  singInGoogle(@GetGoogleUser() user: GoogleUserDto){
    //return this.authService.singInGoogle(user)
  }
  @Public()
  @UseGuards(GoogleGuard)
  @Get("/google")
  async signInWithGoogle() {}

  @Public()
  @UseGuards(LocalGuard)
  @Post('/local')
  @UsePipes(ValidationPipe)
  singInLocal(@GetLocalUser() user: CreateLoginUserDto): Promise<Tokens>{
    return this.authService.localLogin(user)
  }

  @Post('auth/refresh')
  refresh(){

  }

  @Post('auth/logout')
  logout(){

  }




}