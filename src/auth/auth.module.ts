import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import {UsersModule} from "../users/users.module";
//import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [UsersModule,JwtModule.register({

  })],
  providers: [AuthService,UsersService,AccessTokenStrategy,RefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {

}
