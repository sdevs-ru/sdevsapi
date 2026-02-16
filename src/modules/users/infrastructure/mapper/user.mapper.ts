
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { RoleOrmEntity } from '../orm-entities/role.orm-entity';
import { User, Role } from '../../domain/entities';


export class UserMapper {
    static toDomain(orm: UserOrmEntity): User {
        const user = new User(orm.id, orm.email);

        if (orm.roles) {
            orm.roles.forEach((role) =>
                user.assignRole(new Role(role.id, role.name)),
            );
        }

        return user;
    }

    static toOrm(user: User): UserOrmEntity {
        const orm = new UserOrmEntity();
        orm.id = user.id;
        orm.email = user.email;

        // ⚠ достаем роли через reflection (aggregate их не экспонирует)
        const roles = (user as any).roles ?? [];

        orm.roles = roles.map((role: Role) => {
            const roleOrm = new RoleOrmEntity();
            roleOrm.id = role.id;
            roleOrm.name = role.name;
            return roleOrm;
        });

        return orm;
    }
}
