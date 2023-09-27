import { IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'oldPassword$Input your old Password' })
  oldPassword: string;

  @IsNotEmpty({ message: 'newPassword$Password cannot be blank' })
  @Length(8, 30, {
    message: 'newPassword$New password should be between 8 and 30 characters',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'newPassword$New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  newPassword: string;
}
