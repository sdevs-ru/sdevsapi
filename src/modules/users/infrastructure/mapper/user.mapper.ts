
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { User } from '../../domain/entities';
import { RoleOrmEntity } from 'src/modules/roles/infrastructure/orm-entities';


export class UserMapper {
    static toDomain(entity: UserOrmEntity): User {
        const roleIds = entity.roles?.map(r => r.id) ?? [];

        return new User(
            entity.id,
            entity.email,
            roleIds,
        );
    }
    
    static toOrm(user: User): UserOrmEntity {
        const orm = new UserOrmEntity();

        orm.id = user.id;
        orm.email = user.email;

        // ВАЖНО: мы не создаём RoleOrmEntity полноценно!
        orm.roles = user.getRoleIds().map((id) => {
            const roleRef = new RoleOrmEntity();
            roleRef.id = id; // только id — это reference
            return roleRef;
        });

        return orm;
    }
}
