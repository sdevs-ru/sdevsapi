import { Inject } from '@nestjs/common';
import { Organization } from '../domain/organization.entity';
import { ORGANIZATION_REPOSITORY } from '../domain/organization.repository';
import type { OrganizationRepository } from '../domain/organization.repository';

export class CreateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(id: string, name: string) {
    const org = new Organization(id, name);
    await this.repo.save(org);
    return org;
  }
}
