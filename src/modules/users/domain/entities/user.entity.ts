import { Role } from './role.entity';

export class User {
  private roles: Role[] = [];

  constructor(
    public readonly id: string,
    public email: string,
  ) {}

  assignRole(role: Role) {
    if (this.roles.find((r) => r.id === role.id)) {
      return;
    }

    this.roles.push(role);
  }

  removeRole(roleId: string) {
    this.roles = this.roles.filter((r) => r.id !== roleId);
  }

  hasRole(name: string): boolean {
    return this.roles.some((r) => r.name === name);
  }
}
