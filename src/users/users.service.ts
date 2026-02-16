import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Role } from 'src/roles/roles.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['roles'] });
  }

  create(email: string, passwordHash: string, role: Role) {
    const user = this.repo.create({ email, passwordHash, roles: [role] });
    return this.repo.save(user);
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['roles'] });
  }

  findAll() {
    return this.repo.find({ relations: ['roles'] });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
