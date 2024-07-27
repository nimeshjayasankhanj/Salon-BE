import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/users/user.entity';
import { SignUpLoginDto } from 'src/DTO/user';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(data: SignUpLoginDto): Promise<User> {
        try {
            const user = this.userRepository.create(data);
            return this.userRepository.save(user);
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }
}
