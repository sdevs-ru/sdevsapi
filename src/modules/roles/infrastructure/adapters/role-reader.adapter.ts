import { Inject, Injectable } from "@nestjs/common";
import { RoleReaderPort } from "src/modules/users/domain/ports";
import { ROLE_REPOSITORY, type RoleRepository } from "../../domain/repositories";

@Injectable()
export class RoleReaderAdapter implements RoleReaderPort {
    constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) { }

    async findRoleById(id: string) {
        const role = await this.roles.findById(id);
        if (!role) return null;

        return { id: role.id, code: role.code };
    }
}
