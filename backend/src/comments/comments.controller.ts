import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener comentarios de una publicación',
    description:
      'Retorna todos los comentarios de una publicación específica, ordenados por fecha (más recientes primero)',
  })
  @ApiParam({ name: 'postId', description: 'ID de la publicación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentarios obtenida exitosamente',
  })
  findByPost(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentsService.findByPost(+postId);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar comentarios de una publicación',
    description: 'Retorna el número total de comentarios de una publicación',
  })
  @ApiParam({ name: 'postId', description: 'ID de la publicación' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de comentarios',
    schema: { example: 5 },
  })
  countByPost(@Param('postId') postId: string): Promise<number> {
    return this.commentsService.countByPost(+postId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Crear un comentario',
    description:
      'Crea un nuevo comentario en una publicación. Requiere autenticación.',
  })
  @ApiParam({ name: 'postId', description: 'ID de la publicación' })
  @ApiResponse({ status: 201, description: 'Comentario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: any,
  ): Promise<Comment> {
    return this.commentsService.create(+postId, createCommentDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un comentario',
    description:
      'Actualiza un comentario existente. Solo el autor puede editar su comentario.',
  })
  @ApiParam({ name: 'postId', description: 'ID de la publicación' })
  @ApiParam({ name: 'id', description: 'ID del comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario actualizado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Solo el autor puede editar',
  })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: any,
  ): Promise<Comment> {
    return this.commentsService.update(+id, updateCommentDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un comentario',
    description:
      'Elimina un comentario existente. Solo el autor puede eliminar su comentario.',
  })
  @ApiParam({ name: 'postId', description: 'ID de la publicación' })
  @ApiParam({ name: 'id', description: 'ID del comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario eliminado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Solo el autor puede eliminar',
  })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  remove(@Param('id') id: string, @GetUser() user: any): Promise<void> {
    return this.commentsService.remove(+id, user.userId);
  }
}
