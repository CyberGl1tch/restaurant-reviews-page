import {HttpException, HttpStatus, Injectable, UsePipes, ValidationPipe} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entity/User.entity';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  @UsePipes(ValidationPipe)
  createUser(createUserDto: CreateUserDto) {
    const findUser = this.usersRepository
        .createQueryBuilder("user")
        .where("user.email = :email", {email: createUserDto.email})
        .getOne()

    if(findUser) throw new HttpException("User already exist", HttpStatus.FORBIDDEN)
    const user =this.usersRepository.create(createUserDto)
    return this.usersRepository.save(user)
  }

  getUser(id: string) {
    const user =  this.usersRepository
      .createQueryBuilder("user")
      .where("user.id = :userId", {userId: id})
      .getOne()
    return user

  }


  getUsers() {
    const users =  this.usersRepository
      .createQueryBuilder("user")
      .getMany()
    return users
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  deleteUser(id: string) {
    return `This action removes a #${id} user`;
  }
}
