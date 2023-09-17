import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../EndPoints/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import {UsersModule} from "../EndPoints/users/users.module";
import {LocalStrategyStrategy} from "./strategies/localStrategy.strategy";
//import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [forwardRef(() => UsersModule),JwtModule.register({

  })],
  providers: [AuthService,UsersService,AccessTokenStrategy,RefreshTokenStrategy,LocalStrategyStrategy],
  exports: [AuthService,AuthModule]
})
export class AuthModule {

}
