import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { DeleteUserDto } from './dto/delete-user.dto';
import * as bcrypt from 'bcrypt';
import { DecodeJwt } from '../utils/decodeJwt';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly decodeJwt: DecodeJwt,
  ) {}

  async updateNickname(userDetails: UpdateNicknameDto, bearerToken: string) {
    const decodedToken = await this.decodeJwt.decodeJwtToken(bearerToken);
    const userId = decodedToken.id;

    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new HttpException(
        'nickname$User does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.userRepository.update(
        {
          id: userId,
        },
        { nickname: userDetails.nickname },
      );
      return {
        message: 'name changed successfully',
      };
    } catch (e) {
      console.error('Update nickname operation error:', e);
      throw new HttpException(
        'Server error, unable to update name',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(userDetails: UpdatePasswordDto, bearerToken: string) {
    const decodedToken = await this.decodeJwt.decodeJwtToken(bearerToken);
    const userId = decodedToken.id;

    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const isCurrentPasswordMatch = await bcrypt.compare(
      userDetails.oldPassword,
      existingUser.password,
    );

    if (!isCurrentPasswordMatch) {
      throw new HttpException(
        'oldPassword$Incorrect old password, try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isNewPasswordSameAsOld = await bcrypt.compare(
      userDetails.newPassword,
      existingUser.password,
    );

    if (isNewPasswordSameAsOld) {
      throw new HttpException(
        'newPassword$New password should be different from the old one',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedNewPassword = await bcrypt.hash(userDetails.newPassword, 12);

    try {
      await this.userRepository.update(
        {
          id: userId,
        },
        { password: hashedNewPassword },
      );
      return {
        message: 'password updated successfully',
      };
    } catch (e) {
      console.error('Update password operation error:', e);
      throw new HttpException(
        'Server error, unable to update password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(userDetails: DeleteUserDto, bearerToken: string) {
    const decodedToken = await this.decodeJwt.decodeJwtToken(bearerToken);
    const userId = decodedToken.id;

    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(
      userDetails.password,
      existingUser.password,
    );

    if (!isMatch) {
      throw new HttpException(
        'password$Incorrect password, try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.userRepository.delete({ id: userId });
      return {
        message: 'User deleted successfully',
      };
    } catch (e) {
      console.error('Delete operation error:', e);
      throw new HttpException(
        'Server error, unable to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
