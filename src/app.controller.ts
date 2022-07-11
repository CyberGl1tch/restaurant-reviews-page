import { Body, Controller, Get, Req, Res, UseInterceptors } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(@Body() body, @Req() req, @Res() res): void {
    res.status(200).send(this.appService.getHello());
  }
}
