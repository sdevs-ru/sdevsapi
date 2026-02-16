import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories';
import type { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';

@Injectable()
export class GetUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly users: UserRepository,
    ) { }

    async execute(userId: string): Promise<User> {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
