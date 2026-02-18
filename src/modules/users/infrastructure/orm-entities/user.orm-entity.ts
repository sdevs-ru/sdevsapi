import { RoleOrmEntity } from 'src/modules/roles/infrastructure/orm-entities';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';

@Entity('users')
export class UserOrmEntity {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @ManyToMany(() => RoleOrmEntity)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'role_id' },
    })
    roles: RoleOrmEntity[];
}
