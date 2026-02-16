import {
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('user_roles')
export class RoleOrmEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => UserOrmEntity, (user) => user.roles, {
        onDelete: 'CASCADE',
    })
    user: UserOrmEntity;
}
