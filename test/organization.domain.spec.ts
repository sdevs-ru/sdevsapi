import { Organization } from 'src/modules/organization/domain/entities/organization.entity';

describe('Organization domain', () => {
  it('adds member', () => {
    const org = new Organization('org-1', 'Acme');

    org.addMember('user-1', 'member');

    expect(org.getMembers()).toHaveLength(1);
  });

  it('prevents duplicate membership', () => {
    const org = new Organization('org-1', 'Acme');

    org.addMember('user-1', 'member');

    expect(() => org.addMember('user-1', 'member')).toThrow();
  });

  it('removes member', () => {
    const org = new Organization('org-1', 'Acme');

    org.addMember('user-1', 'member');
    org.removeMember('user-1');

    expect(org.getMembers()).toHaveLength(0);
  });


});
