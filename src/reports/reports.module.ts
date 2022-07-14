import {forwardRef, Global, Module} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import {Reviews} from "../entity/Reviews.entity";
import {User} from "../entity/User.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";
import {ReviewsModule} from "../reviews/reviews.module";
import {JwtModule} from "@nestjs/jwt";
import {UsersModule} from "../users/users.module";
import {Report} from "../entity/Report.entity";


@Module({
  controllers: [ReportsController],
  imports: [ReportsModule,TypeOrmModule.forFeature([User,Reviews,Report]),JwtModule,UsersModule,ReportsModule,ReviewsModule],
  exports: [TypeOrmModule,ReportsService,ReportsModule],
  providers: [ReportsService],
})
export class ReportsModule {}
