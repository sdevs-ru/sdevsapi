import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { MembershipOrmEntity } from './membership.orm-entity';

@Entity('organizations')
export class OrganizationOrmEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany(() => MembershipOrmEntity, m => m.organization, {
        cascade: true,
        eager: true,
        orphanedRowAction: 'delete', // ← ВОТ ЭТО КРИТИЧНО
    })
    memberships: MembershipOrmEntity[];
}
