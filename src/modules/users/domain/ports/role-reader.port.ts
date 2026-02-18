export const ROLE_READER_PORT = Symbol('ROLE_READER_PORT');

export interface RoleReaderPort {
    findRoleById(id: string): Promise<{ id: string; code: string } | null>;
}
