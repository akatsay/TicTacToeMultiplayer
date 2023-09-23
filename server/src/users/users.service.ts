import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { SignupDto } from '../auth/dto/signup.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAllUsers() {
    return this.userRepository.find();
  }
  createUser(userDetails: SignupDto) {
    const newUser = this.userRepository.create({
      ...userDetails,
    });
    return this.userRepository.save(newUser);
  }

  deleteUser(userDetails: DeleteUserDto) {
    if (userDetails) {
      return this.userRepository.delete({ id: userDetails.id });
    }
  }
}
