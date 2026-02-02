import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({
        summary: 'Registrar nuevo usuario',
        description: 'Crea una nueva cuenta de usuario con nombre, email y contraseña. La contraseña debe cumplir con los requisitos de seguridad.'
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente. Retorna el token JWT y los datos del usuario.',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 1,
                    name: 'Juan Pérez',
                    email: 'juan@example.com',
                    createdAt: '2026-02-02T14:00:00.000Z'
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de registro inválidos o email ya registrado'
    })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Autentica un usuario existente con email y contraseña. Retorna un token JWT para autenticación.'
    })
    @ApiResponse({
        status: 200,
        description: 'Inicio de sesión exitoso. Retorna el token JWT y los datos del usuario.',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 1,
                    name: 'Juan Pérez',
                    email: 'juan@example.com'
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas'
    })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
}
