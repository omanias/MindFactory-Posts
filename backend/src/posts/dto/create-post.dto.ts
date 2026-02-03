import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Título de la publicación',
    example: 'Mi primera publicación',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Contenido de la publicación',
    example: 'Este es el contenido de mi primera publicación en MindFactory',
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  content: string;
}
