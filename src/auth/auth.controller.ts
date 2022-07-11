import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleUserDto } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { GetGoogleUser, Public } from '../common/decorators';
import { GoogleGuard } from '../common/guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {

  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('/google/callback')
  singInGoogle(@GetGoogleUser() user: GoogleUserDto): Promise<Tokens>{
    return this.authService.singInGoogle(user)
  }
  @Public()
  @UseGuards(GoogleGuard)
  @Get("/google")
  async signInWithGoogle() {}

  @Post('/auth/apple')
  singInApple(){

  }

  @Post('auth/refresh')
  refresh(){

  }

  @Post('auth/logout')
  logout(){

  }




}