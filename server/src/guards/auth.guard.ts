import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return false;
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (e) {
      return false;
    }
  }
}
