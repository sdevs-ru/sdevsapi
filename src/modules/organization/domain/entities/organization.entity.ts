import { Membership } from './membership.entity';

export class Organization {
  private memberships: Membership[] = [];

  constructor(
    public readonly id: string,
    public name: string,
  ) {}

  addMember(userId: string, role: string) {
    if (this.memberships.find((m) => m.userId === userId)) {
      throw new Error('User already in organization');
    }

    this.memberships.push(new Membership(userId, role, new Date()));
  }

  removeMember(userId: string) {
    this.memberships = this.memberships.filter((m) => m.userId !== userId);
  }

  getMembers(): Membership[] {
    return [...this.memberships];
  }

  loadMemberships(memberships: Membership[]) {
    this.memberships = memberships;
  }
}
