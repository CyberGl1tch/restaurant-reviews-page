import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleGuard extends AuthGuard('google'){
  constructor() {
    super();
  }
}