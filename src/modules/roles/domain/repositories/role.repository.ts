import { Role } from "../entities";

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY')

export interface RoleRepository {
    findById(id: string): Promise<Role | null>;
    findByCode(code: string): Promise<Role | null>;
    findAll(): Promise<Role[]>;
    save(role: Role): Promise<void>;
    delete(role: Role): Promise<void>;
}
