import { Inject } from '@nestjs/common';
import { Organization } from '../domain/entities/organization.entity';
import { ORGANIZATION_REPOSITORY } from '../domain/repositories/organization.repository';
import type { OrganizationRepository } from '../domain/repositories/organization.repository';

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
