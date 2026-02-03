import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las publicaciones',
    description:
      'Retorna una lista paginada de publicaciones ordenadas por fecha de creación (más recientes primero)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de publicaciones por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de publicaciones obtenida exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'Mi primera publicación',
            content: 'Este es el contenido de mi publicación',
            userId: 1,
            likedBy: [1, 2],
            dislikedBy: [],
            createdAt: '2026-02-02T14:00:00.000Z',
          },
        ],
        total: 1,
      },
    },
  })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{ data: PostEntity[]; total: number }> {
    return this.postsService.findAll(+page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpPost('like/:id')
  @ApiOperation({
    summary: 'Dar like a una publicación',
    description:
      'Agrega o quita el like del usuario autenticado a una publicación. Si ya tiene like, lo quita. Si tiene dislike, lo quita y agrega like.',
  })
  @ApiParam({ name: 'id', description: 'ID de la publicación' })
  @ApiResponse({
    status: 200,
    description: 'Like agregado/quitado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  like(@Param('id') id: string, @GetUser() user: any): Promise<PostEntity> {
    return this.postsService.like(+id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpPost('dislike/:id')
  @ApiOperation({
    summary: 'Dar dislike a una publicación',
    description:
      'Agrega o quita el dislike del usuario autenticado a una publicación. Si ya tiene dislike, lo quita. Si tiene like, lo quita y agrega dislike.',
  })
  @ApiParam({ name: 'id', description: 'ID de la publicación' })
  @ApiResponse({
    status: 200,
    description: 'Dislike agregado/quitado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  dislike(@Param('id') id: string, @GetUser() user: any): Promise<PostEntity> {
    return this.postsService.dislike(+id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpPost()
  @ApiOperation({
    summary: 'Crear nueva publicación',
    description: 'Crea una nueva publicación asociada al usuario autenticado',
  })
  @ApiResponse({ status: 201, description: 'Publicación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto, user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una publicación por ID',
    description: 'Retorna los detalles de una publicación específica',
  })
  @ApiParam({ name: 'id', description: 'ID de la publicación' })
  @ApiResponse({ status: 200, description: 'Publicación encontrada' })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una publicación',
    description:
      'Actualiza una publicación existente. Solo el autor puede editar su publicación.',
  })
  @ApiParam({ name: 'id', description: 'ID de la publicación' })
  @ApiResponse({
    status: 200,
    description: 'Publicación actualizada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Solo el autor puede editar',
  })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.update(+id, updatePostDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una publicación',
    description:
      'Elimina una publicación existente. Solo el autor puede eliminar su publicación.',
  })
  @ApiParam({ name: 'id', description: 'ID de la publicación' })
  @ApiResponse({
    status: 200,
    description: 'Publicación eliminada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Solo el autor puede eliminar',
  })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  remove(@Param('id') id: string, @GetUser() user: any): Promise<void> {
    return this.postsService.remove(+id, user.userId);
  }
}
