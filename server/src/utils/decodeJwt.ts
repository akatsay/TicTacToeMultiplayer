import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DecodeJwt {
  constructor(private readonly jwtService: JwtService) {}

  async decodeJwtToken(token: string) {
    const cleanToken = token.split(' ')[1];
    const finalToken = cleanToken ? cleanToken : token;
    try {
      const decoded = this.jwtService.decode(finalToken) as {
        id: number;
        nickname: string;
      };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
