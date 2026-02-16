import { AddMemberUseCase } from 'src/modules/organization/application/add-member.usecase';
import { Organization } from 'src/modules/organization/domain/organization.entity';
import { OrganizationRepository } from 'src/modules/organization/domain/organization.repository';

class FakeRepo implements OrganizationRepository {
  org = new Organization('org-1', 'Acme');

  async findById() {
    return this.org;
  }

  async save() {}
}

describe('AddMemberUseCase', () => {
  it('adds user to organization', async () => {
    const repo = new FakeRepo();
    const usecase = new AddMemberUseCase(repo as any);

    await usecase.execute('org-1', 'user-1', 'admin');

    expect(repo.org.getMembers()[0].userId).toBe('user-1');
  });
});
