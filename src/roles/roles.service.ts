import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private repo: Repository<Role>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async getDefaultRole() {
    let role = await this.repo.findOne({ where: { name: 'USER' } });

    if (!role) {
      role = this.repo.create({ name: 'USER' });
      await this.repo.save(role);
    }

    return role;
  }

  async addRoleToUser(userId: string, roleName: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    const role = await this.repo.findOne({ where: { name: roleName } });

    user!.roles.push(role!);
    return this.usersRepo.save(user!);
  }

  async removeRole(userId: string, roleName: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    user!.roles = user!.roles.filter((r) => r.name !== roleName);
    return this.usersRepo.save(user!);
  }
}
