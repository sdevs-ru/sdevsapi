import { Inject, NotFoundException } from "@nestjs/common";
import { ROLE_REPOSITORY, type RoleRepository } from "../../domain/repositories";

export class DeleteRoleUseCase {
    constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) { }

    async execute(id: string) {
        const role = await this.roles.findById(id);
        if (!role) throw new NotFoundException('Role not found');

        await this.roles.delete(role);

        return { success: true };
    }
}
