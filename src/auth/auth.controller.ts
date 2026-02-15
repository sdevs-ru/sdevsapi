import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { SessionsService } from "src/sessions/sessions.service";

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService, private sessions: SessionsService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const tokens = await this.auth.register(dto);
        return tokens;
    }

    @Post('refresh')
    refresh(@Body('refreshToken') token: string) {
        return this.auth.refresh(token);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.auth.loginByCredentials(dto.email, dto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req) {
        await this.sessions.revoke(req.user.sid);
        return { success: true };
    }


}
