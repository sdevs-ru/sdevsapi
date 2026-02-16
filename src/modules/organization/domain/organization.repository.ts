import { Organization } from './organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface OrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  save(org: Organization): Promise<void>;
}
