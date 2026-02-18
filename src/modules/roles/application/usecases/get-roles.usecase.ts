import { Inject } from '@nestjs/common';
import { ROLE_REPOSITORY, type RoleRepository } from '../../domain/repositories';

export class GetRolesUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roles: RoleRepository,
    ) { }

    async execute() {
        const roles = await this.roles.findAll();

        return roles.map(r => ({
            id: r.id,
            code: r.code,
            name: r.name,
        }));
    }
}
