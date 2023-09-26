import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDetails: SignupDto) {
    const existingUser = await this.userRepository.findOneBy({
      nickname: userDetails.nickname,
    });

    if (existingUser) {
      throw new HttpException(
        'User with this nickname already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(userDetails.password, 12);

    try {
      const newUser = this.userRepository.create({
        ...userDetails,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);
      return {
        message: `${userDetails.nickname} signed up successfully`,
      };
    } catch (e) {
      console.error('Error saving new user: ', e);
      throw new HttpException(
        'Unable to sign create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(signInDto: SignInDto) {
    const { nickname, password } = signInDto;

    const existingUser = await this.userRepository.findOneBy({ nickname });

    if (!existingUser) {
      throw new HttpException(
        'User with this nickname does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      throw new HttpException(
        'Incorrect password, try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const token = this.jwtService.sign({
        id: existingUser.id,
        nickname: existingUser.nickname,
      });
      return {
        token,
        // userId: existingUser.id,
        nickname: existingUser.nickname,
        message: `Logged in as ${nickname}`,
      };
    } catch (e) {
      console.error('JWT signing error:', e);
      throw new HttpException(
        'Unable to sign JWT',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
