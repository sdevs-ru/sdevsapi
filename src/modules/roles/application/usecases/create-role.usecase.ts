import { randomUUID } from "crypto";
import { Role } from "../../domain/entities";
import { ROLE_REPOSITORY, type RoleRepository } from "../../domain/repositories";
import { BadRequestException, Inject } from "@nestjs/common";

export class CreateRoleUseCase {
    constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) { }

    async execute(code: string, name: string) {
        const exists = await this.roles.findByCode(code);
        if (exists) throw new BadRequestException('Role already exists');

        const role = new Role(randomUUID(), code.toUpperCase(), name);

        await this.roles.save(role);

        return {
            id: role.id,
            code: role.code,
            name: role.name,
        };
    }

}
