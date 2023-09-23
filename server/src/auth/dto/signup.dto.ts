import {
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: "Don't forget your nickname" })
  @IsString()
  @Length(1, 30, { message: 'Nickname should be less than 30 characters long' })
  nickname: string;
  @IsNotEmpty({ message: 'Password cannot be blank' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  @Length(0, 30, { message: 'Password should be less than 30 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
