import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories';
import type { UserRepository } from '../../domain/repositories';

export interface RemoveRoleCommand {
    userId: string;
    roleId: string;
}

@Injectable()
export class RemoveRoleUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly users: UserRepository,
    ) { }

    async execute(command: RemoveRoleCommand): Promise<void> {
        const user = await this.users.findById(command.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.removeRole(command.roleId);

        await this.users.save(user);
    }
}
