import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
export declare class AuthService {
    private userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    signUp(userDetails: SignupDto): Promise<{
        message: string;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        token: string;
        nickname: string;
        message: string;
    }>;
}
