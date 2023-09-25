import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Headers,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('nickname')
  async updateName(
    @Body(ValidationPipe) updateNickname: UpdateNicknameDto,
    @Headers('Authorization') bearerToken: string,
  ) {
    return await this.usersService.updateNickname(updateNickname, bearerToken);
  }

  @Patch('password')
  async updatePassword(
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
    @Headers('Authorization') bearerToken: string,
  ) {
    return await this.usersService.updatePassword(
      updatePasswordDto,
      bearerToken,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Body(ValidationPipe) deleteUserDto: DeleteUserDto,
    @Headers('Authorization') bearerToken: string,
  ) {
    return await this.usersService.deleteUser(deleteUserDto, bearerToken);
  }
}
