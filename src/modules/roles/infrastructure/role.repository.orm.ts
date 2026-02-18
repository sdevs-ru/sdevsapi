import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../domain/entities";
import { RoleRepository } from "../domain/repositories";
import { RoleOrmEntity } from "./orm-entities";

@Injectable()
export class RoleRepositoryOrm implements RoleRepository {
    constructor(
        @InjectRepository(RoleOrmEntity)
        private readonly repo: Repository<RoleOrmEntity>,
    ) { }

    async findById(id: string): Promise<Role | null> {
        const e = await this.repo.findOne({ where: { id } });
        return e ? new Role(e.id, e.code, e.name, e.isSystem) : null;
    }

    async findByCode(code: string): Promise<Role | null> {
        const e = await this.repo.findOne({ where: { code } });
        return e ? new Role(e.id, e.code, e.name, e.isSystem) : null;
    }

    async findAll(): Promise<Role[]> {
        return (await this.repo.find())
            .map(e => new Role(e.id, e.code, e.name, e.isSystem));
    }

    async save(role: Role) {
        await this.repo.save(role);
    }

    async delete(role: Role) {
        await this.repo.delete(role.id);
    }
}
