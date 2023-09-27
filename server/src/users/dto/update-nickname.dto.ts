import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateNicknameDto {
  @IsNotEmpty({ message: 'nickname$Input new nickname' })
  @MinLength(5, {
    message: 'nickname$New nickname should be at least 5 characters long',
  })
  @MaxLength(30, {
    message: 'nickname$New nickname should be less than 30 characters long',
  })
  nickname: string;
}
