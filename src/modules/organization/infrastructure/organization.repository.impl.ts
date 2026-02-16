import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../domain/organization.entity';
import { OrganizationRepository } from '../domain/organization.repository';
import { OrganizationMapper } from './mapper/organization.mapper';
import { OrganizationOrmEntity } from './orm/organization.orm-entity';
import { MembershipOrmEntity } from './orm/membership.orm-entity';

@Injectable()
export class OrganizationRepositoryImpl implements OrganizationRepository {
    constructor(
        @InjectRepository(OrganizationOrmEntity)
        private repo: Repository<OrganizationOrmEntity>,
    ) { }

    async findById(id: string): Promise<Organization | null> {
        const entity = await this.repo.findOne({ where: { id } });
        return entity ? OrganizationMapper.toDomain(entity) : null;
    }

    async save(org: Organization): Promise<void> {
        await this.repo.manager.transaction(async (manager) => {
            // --- 1. обновляем саму организацию
            await manager.upsert(
                OrganizationOrmEntity,
                { id: org.id, name: org.name },
                ['id'],
            );

            // --- 2. загружаем текущее состояние из БД
            const existing = await manager.find(MembershipOrmEntity, {
                where: { organizationId: org.id },
            });

            const existingMap = new Map(
                existing.map(m => [m.userId, m]),
            );

            const domainMembers = org.getMembers();
            const domainMap = new Map(
                domainMembers.map(m => [m.userId, m]),
            );

            const toInsert: MembershipOrmEntity[] = [];
            const toUpdate: MembershipOrmEntity[] = [];
            const toDelete: MembershipOrmEntity[] = [];

            // --- 3. найти INSERT / UPDATE
            for (const member of domainMembers) {
                const found = existingMap.get(member.userId);

                if (!found) {
                    // INSERT
                    toInsert.push({
                        userId: member.userId,
                        organizationId: org.id,
                        role: member.role,
                        joinedAt: member.joinedAt,
                    } as MembershipOrmEntity);
                } else if (found.role !== member.role) {
                    // UPDATE (например сменили роль)
                    found.role = member.role;
                    toUpdate.push(found);
                }
            }

            // --- 4. найти DELETE
            for (const existingMember of existing) {
                if (!domainMap.has(existingMember.userId)) {
                    toDelete.push(existingMember);
                }
            }

            // --- 5. применяем изменения
            if (toInsert.length) {
                await manager.insert(MembershipOrmEntity, toInsert);
            }

            if (toUpdate.length) {
                await manager.save(MembershipOrmEntity, toUpdate);
            }

            if (toDelete.length) {
                await manager.remove(MembershipOrmEntity, toDelete);
            }
        });
    }


}
