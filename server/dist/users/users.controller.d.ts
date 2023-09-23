import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAll(): Promise<import("../typeorm/entities/User").User[]>;
    delete(deleteUserDto: DeleteUserDto): Promise<import("typeorm").DeleteResult>;
}
