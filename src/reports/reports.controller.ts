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
import { ReportsService } from './reports.service';
import { ReportDto } from './dto/Report.dto';
import {Public} from "../common/decorators";
import {GetUserIDFromSession} from "../common/decorators/extract-user-from-session.decorator";
import {GetUserRoleFromSession} from "../common/decorators/extract-user-role-from-session.decorator";
import {Roles} from "../Enums/Roles";
import {Permission} from "../common/decorators/roles.decorator";
import {Report} from "../entity/Report.entity";

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Public()
    @Post("/create/:reviewId")
    @UsePipes(ValidationPipe)
    async create(@Body() reportDto: ReportDto,@GetUserIDFromSession() userId: number, @Param('reviewId') reviewId: number) {

        let report = await this.reportsService.createReport(reportDto,userId,reviewId)
        if(!report || report["error"]){
            throw new HttpException(`${report["error"] ? report["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        return {
            statusCode: 200,
            message: "Report submitted Successfully",
            report: {
                reason: (report as Report).reason
            }
        }
    }


    @Permission([Roles.ADMIN])
    @Get(':id')
    get(@Param('id') id: number) {
        return this.reportsService.getReport(id)
    }

    @Permission([Roles.ADMIN])
    @Get()
    async getReports() {
        return await this.reportsService.getReports()
    }


    @Permission([Roles.ADMIN])
    @Delete('/delete/:id')
    async delete(@Param('id') reportId: number) {
        let report = await this.reportsService.deleteReport(reportId)
        if(!report || report["error"]){
            throw new HttpException(`${report["error"] ? report["error"] : "Something gone wrong contact administrators"}`, HttpStatus.FORBIDDEN)
        }
        throw new HttpException("Report deleted Successfully", HttpStatus.OK)
    }



}
