import { Inject, NotFoundException } from "@nestjs/common";
import { ROLE_READER_PORT, type RoleReaderPort } from "../../domain/ports";
import { USER_REPOSITORY, type UserRepository } from "../../domain/repositories";

export class AssignRoleUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly users: UserRepository,
        @Inject(ROLE_READER_PORT)
        private readonly roles: RoleReaderPort,
    ) { }
    async execute(userId: string, roleId: string) {
        const role = await this.roles.findRoleById(roleId);
        if (!role) throw new NotFoundException('Role not found');

        const user = await this.users.findById(userId);
        if (!user) throw new NotFoundException('Role not found');

        user.assignRole(role.id);

        await this.users.save(user);
    }
}

