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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../typeorm/entities/User");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const decodeJwt_1 = require("../utils/decodeJwt");
let UsersService = class UsersService {
    constructor(userRepository, decodeJwt) {
        this.userRepository = userRepository;
        this.decodeJwt = decodeJwt;
    }
    async updateNickname(userDetails, bearerToken) {
        const decodedToken = await this.decodeJwt.decodeJwtToken(bearerToken);
        const userId = decodedToken.id;
        const existingUser = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new common_1.HttpException('User does not exist', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            await this.userRepository.update({
                id: userId,
            }, { nickname: userDetails.nickname });
            return;
        }
        catch (e) {
            console.error('Update nickname operation error:', e);
            throw new common_1.HttpException('Server error, unable to update name', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePassword(userDetails, bearerToken) {
        const decodedToken = await this.decodeJwt.decodeJwtToken(bearerToken);
        const userId = decodedToken.id;
        const existingUser = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new common_1.HttpException('User does not exist', common_1.HttpStatus.BAD_REQUEST);
        }
        const isCurrentPasswordMatch = await bcrypt.compare(userDetails.oldPassword, existingUser.password);
        if (!isCurrentPasswordMatch) {
            throw new common_1.HttpException('Incorrect old password, try again', common_1.HttpStatus.BAD_REQUEST);
        }
        const isNewPasswordSameAsOld = await bcrypt.compare(userDetails.newPassword, existingUser.password);
        if (isNewPasswordSameAsOld) {
            throw new common_1.HttpException('New password should be different from the old one', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedNewPassword = await bcrypt.hash(userDetails.newPassword, 12);
        try {
            await this.userRepository.update({
                id: userId,
            }, { password: hashedNewPassword });
            return;
        }
        catch (e) {
            console.error('Update password operation error:', e);
            throw new common_1.HttpException('Server error, unable to update password', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteUser(userDetails, bearerToken) {
        const decodedToken = await this.decodeJwt.decodeJwtToken(bearerToken);
        const userId = decodedToken.id;
        const existingUser = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new common_1.HttpException('User does not exist', common_1.HttpStatus.BAD_REQUEST);
        }
        const isMatch = await bcrypt.compare(userDetails.password, existingUser.password);
        if (!isMatch) {
            throw new common_1.HttpException('Incorrect password, try again', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            await this.userRepository.delete({ id: userId });
            return;
        }
        catch (e) {
            console.error('Delete operation error:', e);
            throw new common_1.HttpException('Server error, unable to delete user', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        decodeJwt_1.DecodeJwt])
], UsersService);
//# sourceMappingURL=users.service.js.map