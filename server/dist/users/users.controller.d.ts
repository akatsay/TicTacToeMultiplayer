import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateName(updateNickname: UpdateNicknameDto, bearerToken: string): Promise<void>;
    updatePassword(updatePasswordDto: UpdatePasswordDto, bearerToken: string): Promise<void>;
    delete(deleteUserDto: DeleteUserDto, bearerToken: string): Promise<void>;
}
