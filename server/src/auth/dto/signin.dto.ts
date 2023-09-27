import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: "nickname$Don't forget your nickname" })
  nickname: string;

  @IsNotEmpty({ message: "password$Don't forget your password" })
  @IsString({ message: 'password$Input password' })
  password: string;
}
