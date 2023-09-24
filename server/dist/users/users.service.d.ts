import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { DeleteUserDto } from './dto/delete-user.dto';
import { DecodeJwt } from '../utils/decodeJwt';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersService {
    private userRepository;
    private readonly decodeJwt;
    constructor(userRepository: Repository<User>, decodeJwt: DecodeJwt);
    updateNickname(userDetails: UpdateNicknameDto, bearerToken: string): Promise<import("typeorm").UpdateResult>;
    updatePassword(userDetails: UpdatePasswordDto, bearerToken: string): Promise<import("typeorm").UpdateResult>;
    deleteUser(userDetails: DeleteUserDto, bearerToken: string): Promise<import("typeorm").DeleteResult>;
}
