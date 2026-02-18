import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/orm-entities';
import { UsersController } from './presentation';
import { AssignRoleUseCase, CreateUserUseCase, GetUserUseCase, RemoveRoleUseCase } from './application/usecases';
import { USER_REPOSITORY } from './domain/repositories';
import { UserOrmRepository } from './infrastructure';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity]),
        RolesModule,
    ],
    controllers: [UsersController],
    providers: [
        CreateUserUseCase,
        AssignRoleUseCase,
        GetUserUseCase,
        RemoveRoleUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: UserOrmRepository,
        },

    ],
})
export class UsersModule { }
