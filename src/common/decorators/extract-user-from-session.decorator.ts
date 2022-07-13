import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {JWTUtil} from "../Utils";

export const GetUserIDFromSession = createParamDecorator((data: string | undefined, context: ExecutionContext)=>{
    const request = context.switchToHttp().getRequest();
    const jwt = request.headers.authorization?.replace('Bearer ', '');
    const json = new JwtService().decode(jwt, { json: true }) as { uuid: string };
    if(!json) return null
    return json["user_id"] ? json["user_id"] : null
})

