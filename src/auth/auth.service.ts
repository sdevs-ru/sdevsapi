import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private users: UsersService,
    private roles: RolesService,
    private sessions: SessionsService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 12);
    const role = await this.roles.getDefaultRole();

    const user = await this.users.create(dto.email, hash, role);

    const tokens = await this.login(user);
    return tokens;
  }

  async login(user: User) {
    const sessionId = randomUUID();

    const tokens = await this.generateTokens(user, sessionId);
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);

    await this.sessions.create(user, refreshHash, sessionId);
    return tokens;
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwt.verifyAsync(refreshToken, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });

    const session = await this.sessions.findById(payload.sid);

    if (!session || session.revoked) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    await this.sessions.revoke(session.id);

    return this.login(session.user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;

    return user;
  }

  async loginByCredentials(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.login(user);
  }

  async generateTokens(user: User, sessionId: string) {
    console.log(user);
    const payload = {
      sub: user.id,
      roles: user.roles.map((r) => r.name),
      sid: sessionId,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }
}
