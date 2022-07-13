import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {JWTUtil} from "../Utils";
import {Roles} from "../../Enums/Roles";

export const GetUserRoleFromSession = createParamDecorator((data: string | undefined, context: ExecutionContext)=>{
    const request = context.switchToHttp().getRequest();
    const jwt = request.headers.authorization?.replace('Bearer ', '');
    const json = new JwtService().decode(jwt, { json: true }) as { uuid: string };
    if(!json) return null
    return json["role"] ? Roles[json["role"]] : null
})