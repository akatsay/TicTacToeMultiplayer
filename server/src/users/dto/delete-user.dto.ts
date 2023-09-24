import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty({ message: "Don't forget your password" })
  password: string;
}
