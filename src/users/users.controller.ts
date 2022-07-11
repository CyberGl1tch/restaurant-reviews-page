import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Public} from "../common/decorators";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post("/create")
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.usersService.getUser(id)
    }

    @Get()
    getUsers() {
        return this.usersService.getUsers()
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(id, updateUserDto)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.deleteUser(id)
    }
}
