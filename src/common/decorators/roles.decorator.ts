import {SetMetadata} from "@nestjs/common";
import {Roles} from "../../Enums/Roles";

export const Permission = (roles: Roles[]) => SetMetadata("roles",roles)