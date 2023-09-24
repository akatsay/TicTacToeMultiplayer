import { JwtService } from '@nestjs/jwt';
export declare class DecodeJwt {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    decodeJwtToken(token: string): Promise<{
        id: number;
        nickname: string;
    }>;
}
