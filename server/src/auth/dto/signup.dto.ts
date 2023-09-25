import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: "Don't forget your nickname" })
  @IsString()
  @MinLength(5, { message: 'nickname should be at least 5 characters long' })
  @MaxLength(30, {
    message: 'Nickname should be less than 30 characters long',
  })
  nickname: string;
  @IsNotEmpty({ message: 'Password cannot be blank' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  @MaxLength(30, { message: 'Password should be less than 30 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
