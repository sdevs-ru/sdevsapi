import { Inject } from '@nestjs/common';
import { ORGANIZATION_REPOSITORY } from '../domain/repositories/organization.repository';
import type { OrganizationRepository } from '../domain/repositories/organization.repository';

export class RemoveMemberUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(orgId: string, userId: string) {
    const org = await this.repo.findById(orgId);
    if (!org) throw new Error('Organization not found');

    org.removeMember(userId);
    await this.repo.save(org);
  }
}
