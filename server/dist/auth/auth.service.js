"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../typeorm/entities/User");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async signUp(userDetails) {
        const existingUser = await this.userRepository.findOneBy({
            nickname: userDetails.nickname,
        });
        if (existingUser) {
            throw new common_1.HttpException('nickname$User with this nickname already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(userDetails.password, 12);
        try {
            const newUser = this.userRepository.create({
                ...userDetails,
                password: hashedPassword,
            });
            await this.userRepository.save(newUser);
            return {
                message: `${userDetails.nickname} signed up successfully`,
            };
        }
        catch (e) {
            console.error('Error saving new user: ', e);
            throw new common_1.HttpException('Unable to create user', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async signIn(signInDto) {
        const { nickname, password } = signInDto;
        const existingUser = await this.userRepository.findOneBy({ nickname });
        if (!existingUser) {
            throw new common_1.HttpException('nickname$User with this nickname does not exist', common_1.HttpStatus.BAD_REQUEST);
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            throw new common_1.HttpException('password$Incorrect password, try again', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const token = this.jwtService.sign({
                id: existingUser.id,
                nickname: existingUser.nickname,
            });
            return {
                token,
                nickname: existingUser.nickname,
                message: `Logged in as ${nickname}`,
            };
        }
        catch (e) {
            console.error('JWT signing error:', e);
            throw new common_1.HttpException('Unable to sign JWT', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map