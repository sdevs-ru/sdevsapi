import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './sessions.entity';
import { User } from 'src/users/users.entity';
import dayjs from 'dayjs';

@Injectable()
export class SessionsService {
  constructor(@InjectRepository(Session) private repo: Repository<Session>) {}

  async create(user: User, refreshHash: string, sessionId: string) {
    const session = this.repo.create({
      id: sessionId, // ← используем тот же id что в JWT
      user,
      refreshTokenHash: refreshHash,
      expiresAt: dayjs().add(30, 'day').toDate(),
      revoked: false,
    });

    return this.repo.save(session);
  }

  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: {
        user: {
          roles: true, // ← вложенная relation (TypeORM >= 0.3)
        },
      },
    });
  }

  async revoke(id: string) {
    await this.repo.update(id, { revoked: true });
  }
}
