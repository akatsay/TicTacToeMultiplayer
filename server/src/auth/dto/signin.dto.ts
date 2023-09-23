import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: "Don't forget your nickname" })
  nickname: string;

  @IsNotEmpty({ message: "Don't forget your password" })
  @IsString({ message: 'Input password' })
  password: string;
}
