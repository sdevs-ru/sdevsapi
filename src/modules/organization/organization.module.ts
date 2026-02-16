import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddMemberUseCase } from "./application/add-member.usecase";
import { CreateOrganizationUseCase } from "./application/create-organization.usecase";
import { RemoveMemberUseCase } from "./application/remove-member.usecase";
import { OrganizationRepositoryImpl } from "./infrastructure/organization.repository.impl";
import { MembershipOrmEntity } from "./infrastructure/orm/membership.orm-entity";
import { OrganizationOrmEntity } from "./infrastructure/orm/organization.orm-entity";
import { OrganizationsController } from "./presentation/organization.controller";
import { ORGANIZATION_REPOSITORY } from "./domain/repositories/organization.repository";

@Module({
    imports: [TypeOrmModule.forFeature([OrganizationOrmEntity, MembershipOrmEntity])],
    controllers: [OrganizationsController],
    providers: [
        CreateOrganizationUseCase,
        AddMemberUseCase,
        RemoveMemberUseCase,

        {
            provide: ORGANIZATION_REPOSITORY,
            useClass: OrganizationRepositoryImpl,
        },
    ],
})
export class OrganizationsModule { }

