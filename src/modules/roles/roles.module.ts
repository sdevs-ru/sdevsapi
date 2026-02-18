import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleOrmEntity } from "./infrastructure/orm-entities";
import { CreateRoleUseCase, DeleteRoleUseCase, GetRolesUseCase } from "./application/usecases";
import { RoleRepositoryOrm } from "./infrastructure";
import { RoleReaderAdapter } from "./infrastructure/adapters";
import { ROLE_REPOSITORY } from "./domain/repositories";
import { RolesController } from "./presentation";
import { ROLE_READER_PORT } from "../users/domain/ports";


@Module({
    imports: [TypeOrmModule.forFeature([RoleOrmEntity])],
    controllers: [RolesController],
    providers: [
        RoleRepositoryOrm,
        CreateRoleUseCase,
        DeleteRoleUseCase,
        GetRolesUseCase,
        RoleReaderAdapter,
        {
            provide: ROLE_READER_PORT,
            useExisting: RoleReaderAdapter,
        },
        {
            provide: ROLE_REPOSITORY,
            useClass: RoleRepositoryOrm,
        },
    ],
    exports: [ROLE_READER_PORT],
})
export class RolesModule { }