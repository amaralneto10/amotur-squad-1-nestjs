import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService) {}

    @Post('register-admin')
    @ApiOperation({ summary: 'Registrar novo administrador' })
    registerAdmin(@Body() dto: CreateAdminDto) {
        return this.authService.registerAdmin(dto)
    }

    @Post('login')
    @ApiOperation({ summary: 'Login de qualquer usuário (admin ou turista) '})
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

}
