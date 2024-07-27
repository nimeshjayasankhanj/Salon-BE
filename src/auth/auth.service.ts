import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { SignUpLoginDto } from 'src/DTO/user';
import { User } from 'src/entity/users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        try {
            const payload = { email: user.email, sub: user.id };
            const data = {
                access_token: await this.jwtService.signAsync(payload),
                refresh_token: this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET as string, expiresIn: '7d' }),
            };
            return data;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async signup(data: SignUpLoginDto): Promise<void> {
        try {
            await this.usersService.create(data);
        } catch (error) {
            throw error;
        }
    }

    async checkEmailUsed(data: SignUpLoginDto): Promise<User> {
        try {
            const user = await this.usersService.findByEmail(data.email);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET as string });
            const user = await this.usersService.findByEmail(payload.email);
            if (!user) {
                throw new UnauthorizedException();
            }
            const newPayload = { email: user.email, sub: user.id };
            return {
                access_token: this.jwtService.sign(newPayload),
                refresh_token: this.jwtService.sign(newPayload, { secret: process.env.JWT_REFRESH_SECRET as string, expiresIn: '7d' }),
            };
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
