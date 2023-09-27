import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty({ message: "password$Don't forget your password" })
  password: string;
}
