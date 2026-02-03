import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez Actualizado',
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'nuevoemail@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
