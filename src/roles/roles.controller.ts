import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { RoleDto } from './dto/role.dto';

@Controller('role')
export class RolesController {
    constructor(private roles: RolesService) { }

    @Post('add')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async ddRole(@Body() dto: RoleDto) {
        return this.roles.addRoleToUser(dto.userId, dto.role);
    }

    @Post('unset')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    removeRole(@Body() dto: RoleDto) {
        return this.roles.removeRole(dto.userId, dto.role);
    }
}
