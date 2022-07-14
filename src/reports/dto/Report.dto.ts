import {IsEmail, IsNotEmpty, IsOptional, MinLength} from "class-validator";


export class ReportDto {
    @IsNotEmpty({message: "Reason must be specified"})
    reason: string;

}
