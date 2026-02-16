import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleOrmEntity, UserOrmEntity } from './infrastructure/orm-entities';
import { UsersController } from './presentation';
import { AssignRoleUseCase, CreateUserUseCase, GetUserUseCase, RemoveRoleUseCase } from './application/usecases';
import { USER_REPOSITORY } from './domain/repositories';
import { UserOrmRepository } from './infrastructure';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity]),
    ],
    controllers: [UsersController],
    providers: [
        CreateUserUseCase,
        AssignRoleUseCase,
        RemoveRoleUseCase,
        GetUserUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: UserOrmRepository,
        },
    ],
})
export class UsersModule { }
