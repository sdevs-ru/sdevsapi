import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../domain/repositories';
import { UserOrmEntity } from './orm-entities';
import { User } from '../domain/entities';
import { UserMapper } from './mapper';



@Injectable()
export class UserOrmRepository implements UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly repo: Repository<UserOrmEntity>,
    ) { }

    async save(user: User): Promise<void> {
        const orm = UserMapper.toOrm(user);
        await this.repo.save(orm);
    }

    async findById(id: string): Promise<User | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? UserMapper.toDomain(orm) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const orm = await this.repo.findOne({ where: { email } });
        return orm ? UserMapper.toDomain(orm) : null;
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
