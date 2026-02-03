import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Contenido del comentario',
    example: '¡Excelente publicación!',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
  @MinLength(1, { message: 'El comentario debe tener al menos 1 carácter' })
  content: string;
}
