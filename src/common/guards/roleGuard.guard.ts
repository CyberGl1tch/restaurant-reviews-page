import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import {GetUserRoleFromSession} from "../decorators/extract-user-role-from-session.decorator";
import {JwtService} from "@nestjs/jwt";
import {GetUserIDFromSession} from "../decorators/extract-user-from-session.decorator";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector,
                private jwtService: JwtService) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride("roles",[context.getHandler(),context.getClass()])
        if(roles){
            const request = context.switchToHttp().getRequest()
            if(!request) return true
            const jwt = request.headers.authorization?.replace('Bearer ', '');
            const json = new JwtService().decode(jwt, { json: true }) as { uuid: string };
            if(!json) return true
            let role = json["role"]
            return roles.map(role => role.toLowerCase().trim()).includes(role.toLowerCase().trim())
        }
        return true
    }
}