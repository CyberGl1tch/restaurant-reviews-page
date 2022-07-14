import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { Module } from "@nestjs/common";

import { OrmconfigModule } from "./ormconfig/ormconfig.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";
import { AuthController } from "./auth/auth.controller";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "./common/guards";
import {RestaurantModule} from "./restaurant/restaurant.module";
import {ReviewsModule} from "./reviews/reviews.module";
import {RoleGuard} from "./common/guards/roleGuard.guard";
import {JwtModule} from "@nestjs/jwt";
import {ReportsModule} from "./reports/reports.module";

@Module({
    imports: [JwtModule,ReportsModule,ReviewsModule,RestaurantModule,UsersModule, AuthModule, TypeOrmModule.forRootAsync({
        useFactory: async () => {

            let config = new OrmconfigModule();
            return Object.assign(config.get());
        }

    }), OrmconfigModule,TypeOrmModule],
    controllers: [AppController, UsersController, AuthController],
    providers: [AppService, {
        provide: APP_GUARD,
        useClass: AccessTokenGuard
    },
        {
            provide: APP_GUARD,
            useClass: RoleGuard
        }]
})
export class AppModule {
}
