import {forwardRef, Global, Module} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import {Reviews} from "../entity/Reviews.entity";
import {User} from "../entity/User.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "../entity/Restaurant.entity";
import {UsersModule} from "../users/users.module";
import {ReviewsModule} from "../reviews/reviews.module";
import {UsersService} from "../users/users.service";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";


@Module({
  controllers: [RestaurantController],
  imports: [RestaurantModule,UsersModule,ReviewsModule,TypeOrmModule.forFeature([Reviews,Restaurant,User]),forwardRef(() => ReviewsModule),AuthModule],
  exports: [TypeOrmModule,RestaurantModule,RestaurantService],
  providers: [UsersService,RestaurantService],
})
export class RestaurantModule {}
