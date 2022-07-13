import {forwardRef, Global, Module} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {Reviews} from "../entity/Reviews.entity";
import {User} from "../entity/User.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";
import {ReviewsModule} from "../reviews/reviews.module";
import {JwtModule} from "@nestjs/jwt";


@Module({
  controllers: [UsersController],
  imports: [UsersModule,TypeOrmModule.forFeature([User]),forwardRef(() => AuthModule),JwtModule],
  exports: [TypeOrmModule,UsersService,UsersModule],
  providers: [UsersService],
})
export class UsersModule {}
