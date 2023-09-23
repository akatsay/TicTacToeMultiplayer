import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) signupDto: SignupDto) {
    return await this.authService.signUp(signupDto);
  }

  @Post('signin')
  async signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
}
