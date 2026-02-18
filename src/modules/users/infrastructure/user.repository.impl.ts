import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../domain/repositories';
import { UserOrmEntity } from './orm-entities';
import { User } from '../domain/entities';
import { UserMapper } from './mapper';
import { RoleOrmEntity } from 'src/modules/roles/infrastructure/orm-entities';



@Injectable()
export class UserOrmRepository implements UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly repo: Repository<UserOrmEntity>,
    ) { }

    async save(user: User): Promise<void> {
        let orm = await this.repo.findOne({
            where: { id: user.id },
            relations: ['roles'],
        });

        if (!orm) {
            orm = new UserOrmEntity();
            orm.id = user.id;
        }

        orm.email = user.email;

        await this.repo.save(orm);

        const newRoleIds = user.getRoleIds();
        const currentRoleIds = orm.roles?.map(r => r.id) ?? [];

        const toAdd = newRoleIds.filter(id => !currentRoleIds.includes(id));
        const toRemove = currentRoleIds.filter(id => !newRoleIds.includes(id));

        const relation = this.repo
            .createQueryBuilder()
            .relation(UserOrmEntity, 'roles')
            .of(orm.id);

        if (toAdd.length) {
            await relation.add(toAdd);
        }

        if (toRemove.length) {
            await relation.remove(toRemove);
        }
    }


    async findById(id: string): Promise<User | null> {
        const orm = await this.repo.findOne({
            where: { id },
            relations: ['roles'], // ← обязательно
        });

        if (!orm) return null;

        return UserMapper.toDomain(orm);
    }

    async findByEmail(email: string): Promise<User | null> {
        const orm = await this.repo.findOne({ where: { email } });
        return orm ? UserMapper.toDomain(orm) : null;
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
