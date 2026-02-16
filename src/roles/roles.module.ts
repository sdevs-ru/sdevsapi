import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { RolesController } from './roles.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User]), UsersModule],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
