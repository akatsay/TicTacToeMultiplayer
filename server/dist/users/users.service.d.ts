import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAllUsers(): Promise<User[]>;
    createUser(userDetails: CreateUserDto): Promise<User>;
    deleteUser(userDetails: DeleteUserDto): Promise<import("typeorm").DeleteResult>;
}
