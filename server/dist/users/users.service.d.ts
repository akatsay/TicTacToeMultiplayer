import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { SignupDto } from '../auth/dto/signup.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAllUsers(): Promise<User[]>;
    createUser(userDetails: SignupDto): Promise<User>;
    deleteUser(userDetails: DeleteUserDto): Promise<import("typeorm").DeleteResult>;
}
