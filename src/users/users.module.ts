import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {Reviews} from "../entity/Reviews.entity";
import {User} from "../entity/User.entity";
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule,UsersService],
  providers: [UsersService],
})
export class UsersModule {}
