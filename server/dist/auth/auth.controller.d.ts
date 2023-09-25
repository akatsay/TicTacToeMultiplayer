import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(signupDto: SignupDto): Promise<void>;
    signIn(signInDto: SignInDto): Promise<{
        token: string;
        nickname: string;
        message: string;
    }>;
}
