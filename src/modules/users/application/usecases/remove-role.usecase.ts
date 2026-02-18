import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_READER_PORT, type RoleReaderPort } from '../../domain/ports/role-reader.port';
import { USER_REPOSITORY, type UserRepository } from '../../domain/repositories';


@Injectable()
export class RemoveRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,

    @Inject(ROLE_READER_PORT)
    private readonly roles: RoleReaderPort,
  ) {}

  async execute(userId: string, roleId: string): Promise<void> {
    // Проверяем, что роль вообще существует (важно!)
    const role = await this.roles.findRoleById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.removeRole(roleId);

    await this.users.save(user);
  }
}
