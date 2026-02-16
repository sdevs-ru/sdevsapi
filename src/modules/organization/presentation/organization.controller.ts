import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { AddMemberUseCase } from '../application/add-member.usecase';
import { CreateOrganizationUseCase } from '../application/create-organization.usecase';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { RemoveMemberUseCase } from '../application/remove-member.usecase';

@Controller('organizations')
export class OrganizationsController {
    constructor(
        private createOrg: CreateOrganizationUseCase,
        private addMember: AddMemberUseCase,
        private removeMember: RemoveMemberUseCase
    ) { }

    @Post()
    create(@Body() dto: CreateOrganizationDto) {
        return this.createOrg.execute(dto.id, dto.name);
    }

    @Post(':id/members')
    add(@Param('id') id: string, @Body() dto: AddMemberDto) {
        return this.addMember.execute(id, dto.userId, dto.role);
    }

    @Delete(':id/members/:userId')
    remove(
        @Param('id') id: string,
        @Param('userId') userId: string,
    ) {
        return this.removeMember.execute(id, userId);
    }

}
