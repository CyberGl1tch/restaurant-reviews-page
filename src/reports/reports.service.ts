import {forwardRef, HttpException, HttpStatus, Inject, Injectable, UsePipes, ValidationPipe} from '@nestjs/common';
import { ReportDto } from './dto/Report.dto';
import { User } from '../entity/User.entity';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthService} from "../auth/auth.service";
import {GetUserIDFromSession} from "../common/decorators/extract-user-from-session.decorator";
import {GetUserRoleFromSession} from "../common/decorators/extract-user-role-from-session.decorator";
import {Roles} from "../Enums/Roles";
import crypto from "crypto";
import {Report} from "../entity/Report.entity";
import {UsersService} from "../users/users.service";
import {ReviewsService} from "../reviews/reviews.service";

@Injectable()
export class ReportsService {
  private error : String = null

  constructor(
      @InjectRepository(Report)
      private reportRepository: Repository<Report>,
      private userService: UsersService,
      private reviewService: ReviewsService
  ) {}

  @UsePipes(ValidationPipe)
  async createReport(reportDto: ReportDto,userId: number,reviewId: number) {
    this.error = null
    let user = await this.userService.getUser(userId).catch(e=> this.error = e.message)
    if(!user) return {
      error: this.error ? this.error: "User not Found"
    }

    let review = await this.reviewService.getReview(reviewId).catch(e=> this.error = e.message)
    if(!review) return {
      error: this.error ? this.error: "Review not Found"
    }

    let report = await this.reportRepository.create(reportDto)
    report.user = user
    report.review = review
    let createdReport = await this.reportRepository.save(report)
    return createdReport
  }

  async getReport(id: number) {
    const user =  await this.reportRepository
      .createQueryBuilder("report")
      .where("report.id = :reportId", {reportId: id})
      .getOne()
    return user

  }


  async getReports() {
    this.error = null
    const reports =  await this.reportRepository
      .createQueryBuilder("report")
        .leftJoin("report.user","user")
        .leftJoin("report.review","review")
        .addSelect(["user.firstName","user.lastName","user.icon"])
        .addSelect(["review.review"])
        .getMany()
    if(!reports) return {
      error: this.error ? this.error: "Cannot fetch any user"
    }
    return reports
  }


  async deleteReport(reportId: number) {
    this.error = null
    const report = await this.getReport(reportId).catch(e=> this.error = e.message)
    if(!report) return {
      error: this.error ? this.error: "Report not Found"
    }

    let deletedReport = await this.reportRepository.delete(reportId)
    if(!deletedReport) return {
      error: this.error ? this.error: "Report not Found"
    }
    return deletedReport;
  }
}
