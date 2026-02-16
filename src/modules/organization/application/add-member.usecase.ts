import { Inject } from '@nestjs/common';
import { ORGANIZATION_REPOSITORY } from '../domain/repositories/organization.repository';
import type { OrganizationRepository } from '../domain/repositories/organization.repository';

export class AddMemberUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(orgId: string, userId: string, role: string) {
    const org = await this.repo.findById(orgId);
    if (!org) throw new Error('Organization not found');

    org.addMember(userId, role);
    await this.repo.save(org);
  }
}
