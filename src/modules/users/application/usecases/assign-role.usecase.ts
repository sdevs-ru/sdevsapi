import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories';
import type { UserRepository } from '../../domain/repositories';
import { Role } from '../../domain/entities';


export interface AssignRoleCommand {
    userId: string;
    roleId: string;
    roleName: string;
}

@Injectable()
export class AssignRoleUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly users: UserRepository,
    ) { }

    async execute(command: AssignRoleCommand): Promise<void> {
        const user = await this.users.findById(command.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.assignRole(new Role(command.roleId, command.roleName));

        await this.users.save(user);
    }
}
