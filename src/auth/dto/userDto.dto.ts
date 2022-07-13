import {Roles} from "../../Enums/Roles";

export class LocalUserDto {
    id?: number
    role?: Roles
    email: string
    password: string
    firstName: string
    lastName: string
}