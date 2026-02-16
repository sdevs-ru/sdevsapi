import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { USER_REPOSITORY } from '../../domain/repositories';
import type { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';



export interface CreateUserCommand {
    email: string;
}

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly users: UserRepository,
    ) { }

    async execute(command: CreateUserCommand): Promise<User> {
        const exists = await this.users.findByEmail(command.email);
        if (exists) {
            throw new Error('User already exists');
        }

        const user = new User(randomUUID(), command.email);

        await this.users.save(user);

        return user;
    }
}
