import {
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';

@Entity('users')
export class UserOrmEntity {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => RoleOrmEntity, (role) => role.user, {
        cascade: true,
        eager: true,
    })
    roles: RoleOrmEntity[];
}
