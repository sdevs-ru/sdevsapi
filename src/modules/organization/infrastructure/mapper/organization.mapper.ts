import { Membership } from "../../domain/entities/membership.entity";
import { Organization } from "../../domain/entities/organization.entity";
import { MembershipOrmEntity } from "../orm/membership.orm-entity";
import { OrganizationOrmEntity } from "../orm/organization.orm-entity";

export class OrganizationMapper {
  static toDomain(entity: OrganizationOrmEntity): Organization {
    const org = new Organization(entity.id, entity.name);

    const memberships = entity.memberships.map(
      m => new Membership(m.userId, m.role, m.joinedAt),
    );

    org.loadMemberships(memberships);
    return org;
  }

  static toOrm(domain: Organization): OrganizationOrmEntity {
    const orm = new OrganizationOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;

    orm.memberships = domain.getMembers().map(m => {
      const mem = new MembershipOrmEntity();
      mem.userId = m.userId;
      mem.organizationId = domain.id;
      mem.role = m.role;
      mem.joinedAt = m.joinedAt;
      return mem;
    });

    return orm;
  }
}
