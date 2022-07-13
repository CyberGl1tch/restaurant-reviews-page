import { Global, Module,forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import {Reviews} from "../entity/Reviews.entity";
import {User} from "../entity/User.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "../entity/Restaurant.entity";
import {RestaurantModule} from "../restaurant/restaurant.module";
import {UsersModule} from "../users/users.module";
import {UsersService} from "../users/users.service";


@Module({
  controllers: [ReviewsController],
  imports: [UsersModule,TypeOrmModule.forFeature([Reviews,User,Restaurant]),ReviewsModule,forwardRef(() => RestaurantModule)],
  exports: [TypeOrmModule,ReviewsService],
  providers: [ReviewsService]
})
export class ReviewsModule {}
