import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get()
    @ApiOperation({
        summary: 'Obtener todos los usuarios',
        description: 'Retorna una lista de todos los usuarios registrados (sin contraseñas)'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'Juan Pérez',
                    email: 'juan@example.com',
                    createdAt: '2026-02-02T14:00:00.000Z'
                }
            ]
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado - Token JWT requerido' })
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un usuario',
        description: 'Actualiza los datos de un usuario. Solo el propio usuario puede editar su perfil.'
    })
    @ApiParam({ name: 'id', description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
    @ApiResponse({ status: 401, description: 'No autorizado - Token JWT requerido' })
    @ApiResponse({ status: 403, description: 'Prohibido - Solo puedes editar tu propio perfil' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @GetUser() user: any
    ): Promise<User> {
        return this.usersService.update(+id, updateUserDto, user.userId);
    }
}
