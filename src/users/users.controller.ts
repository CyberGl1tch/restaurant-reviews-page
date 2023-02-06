import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    UsePipes,
    ValidationPipe,
    HttpException, HttpStatus
} from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateLoginUserDto } from './dto/create-login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Public} from "../common/decorators";
import {GetUserIDFromSession} from "../common/decorators/extract-user-from-session.decorator";
import {GetUserRoleFromSession} from "../common/decorators/extract-user-role-from-session.decorator";
import {Roles} from "../Enums/Roles";
import {Permission} from "../common/decorators/roles.decorator";
import {LocationDto} from "./dto/location.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post("/create")
    @UsePipes(ValidationPipe)
    async create(@Body() createUserDto: CreateLoginUserDto) {

        let user = await this.usersService.createUser(createUserDto)
        if(!user){
            throw new HttpException("User already exist", HttpStatus.FORBIDDEN)
        }
        return user
    }

    @Public()
    @Post("/getNearbyRestaurants")
    @UsePipes(ValidationPipe)
    async getNearbyRestaurants(@GetUserIDFromSession() userId: number,@Body() location: LocationDto) {
        return this.usersService.getNearbyRestaurantsBasedOnLocation(location)
    }

    @Get('/self')
    async getUserInfoSelf(@GetUserIDFromSession() userId: number) {
        let user = await this.usersService.getUser(userId)
        delete user.password
        return user
    }

    @Get('/suggestedRestaurants')
    async getSuggestedRestaurants(@GetUserIDFromSession() userId: number) {
        return this.usersService.getUserSuggestedRestaurant(userId)
    }


    @Permission([Roles.ADMIN])
    @Get(':id')
    get(@Param('id') id: number) {
        return this.usersService.getUser(id)
    }

    @Permission([Roles.ADMIN])
    @Get()
    async getUsers() {
        return await this.usersService.getUsers()
    }
    @Patch('/update/:id')
    async update(@GetUserRoleFromSession() role: Roles,@Param('id') specificUserId: number, @Body() updateUserDto: UpdateUserDto) {
        let updateUser = await this.usersService.updateUser(specificUserId, role,updateUserDto)
        console.log(updateUser)
        if(!updateUser || updateUser["error"]){
            throw new HttpException(`${updateUser["error"] ? updateUser["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("User updated Successfully", HttpStatus.OK)
    }

    @Patch('/update')
    async updateSelf(@GetUserIDFromSession() userId: number,@Body() updateUserDto: UpdateUserDto) {
        let updateUser = await this.usersService.updateUser(userId, null,updateUserDto)
        if(!updateUser || updateUser["error"]){
            throw new HttpException(`${updateUser["error"] ? updateUser["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("User updated Successfully", HttpStatus.OK)
    }
    @Delete('/delete/:id')
    async delete(@GetUserIDFromSession() userId: number, @GetUserRoleFromSession() role: Roles,@Param('id') specificUserId: number) {
        let user = await this.usersService.deleteUser(userId,role,specificUserId)
        if(!user || user["error"]){
            throw new HttpException(`${user["error"] ? user["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("User deleted Successfully", HttpStatus.OK)
    }
    @Delete('/delete')
    async deleteSelf(@GetUserIDFromSession() userId: number, @GetUserRoleFromSession() role: Roles,@Param('id') specificUserId: number) {
        await this.delete(userId,role,specificUserId)
    }


}
