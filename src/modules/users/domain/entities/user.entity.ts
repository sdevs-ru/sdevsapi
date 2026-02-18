export class User {
  constructor(
    public readonly id: string,
    public email: string,
    private roleIds: string[] = [],
  ) { }

  assignRole(roleId: string) {
    if (this.roleIds.includes(roleId)) {
      return;
    }

    this.roleIds.push(roleId);
  }

  removeRole(roleId: string) {
    this.roleIds = this.roleIds.filter(id => id !== roleId);
  }

  hasRole(roleId: string): boolean {
    return this.roleIds.includes(roleId);
  }
  getRoleIds(): string[] {
    return [...this.roleIds];
  }
}
