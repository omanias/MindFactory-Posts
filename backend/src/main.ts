import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('MindFactory Posts API')
    .setDescription(
      'API para la plataforma de publicaciones MindFactory. Permite gestionar usuarios, publicaciones y comentarios.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('users', 'Endpoints de gestión de usuarios')
    .addTag('posts', 'Endpoints de gestión de publicaciones')
    .addTag('comments', 'Endpoints de gestión de comentarios')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'MindFactory API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
});

