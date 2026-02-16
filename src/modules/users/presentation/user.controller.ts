import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { AssignRoleUseCase, CreateUserUseCase, GetUserUseCase, RemoveRoleUseCase } from '../application/usecases';



@Controller('users')
export class UsersController {
    constructor(
        private readonly createUser: CreateUserUseCase,
        private readonly assignRole: AssignRoleUseCase,
        private readonly removeRole: RemoveRoleUseCase,
        private readonly getUser: GetUserUseCase,
    ) { }

    @Post()
    create(@Body('email') email: string) {
        return this.createUser.execute({ email });
    }

    @Post(':id/roles')
    assign(
        @Param('id') userId: string,
        @Body() body: { roleId: string; roleName: string },
    ) {
        return this.assignRole.execute({ userId, ...body });
    }

    @Delete(':id/roles/:roleId')
    remove(@Param('id') userId: string, @Param('roleId') roleId: string) {
        return this.removeRole.execute({ userId, roleId });
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.getUser.execute(id);
    }
}
