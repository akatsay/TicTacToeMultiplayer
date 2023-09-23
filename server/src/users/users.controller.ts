import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll() {
    return await this.usersService.findAllUsers();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Body() deleteUserDto: DeleteUserDto) {
    return await this.usersService.deleteUser(deleteUserDto);
  }
}
