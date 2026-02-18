import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
} from '@nestjs/common';
import { CreateRoleUseCase, DeleteRoleUseCase, GetRolesUseCase } from '../application/usecases';
import { CreateRoleDto } from './create-role.dto';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly createRole: CreateRoleUseCase,
        private readonly deleteRole: DeleteRoleUseCase,
        private readonly getRoles: GetRolesUseCase,
    ) { }

    @Post()
    async create(@Body() dto: CreateRoleDto) {
        return this.createRole.execute(dto.code, dto.name);
    }

    @Get()
    async findAll() {
        return this.getRoles.execute();
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.deleteRole.execute(id);
    }
}
