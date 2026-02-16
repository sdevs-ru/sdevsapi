import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { OrganizationOrmEntity } from './organization.orm-entity';

@Entity('organization_memberships')
export class MembershipOrmEntity {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    organizationId: string;

    @ManyToOne(() => OrganizationOrmEntity, o => o.memberships, {
        onDelete: 'CASCADE',
        nullable: false, // ← обязательно
    })
    @JoinColumn({ name: 'organizationId' })
    organization: OrganizationOrmEntity;

    @Column()
    role: string;

    @Column()
    joinedAt: Date;
}
