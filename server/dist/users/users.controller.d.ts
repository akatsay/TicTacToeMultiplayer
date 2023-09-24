import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateName(updateNickname: UpdateNicknameDto, bearerToken: string): Promise<import("typeorm").UpdateResult>;
    updatePassword(updatePasswordDto: UpdatePasswordDto, bearerToken: string): Promise<import("typeorm").UpdateResult>;
    delete(deleteUserDto: DeleteUserDto, bearerToken: string): Promise<import("typeorm").DeleteResult>;
}
