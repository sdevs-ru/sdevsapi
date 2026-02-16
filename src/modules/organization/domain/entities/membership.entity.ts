export class Membership {
  constructor(
    public readonly userId: string,
    public role: string,
    public readonly joinedAt: Date,
  ) {}

  changeRole(newRole: string) {
    if (!newRole) throw new Error('Role required');
    this.role = newRole;
  }
}
