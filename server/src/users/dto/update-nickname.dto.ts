import { IsNotEmpty, Length } from 'class-validator';

export class UpdateNicknameDto {
  @IsNotEmpty({ message: 'Input new nickname' })
  @Length(2, 30, {
    message: 'New nickname should be less than 30 characters long',
  })
  nickname: string;
}
