import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, SwaggerCustomOptions } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { express } from 'express-useragent';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(express());
  const appPort: number = (app.get(ConfigService).get('API_PORT') as number) || 3000;

  //CORS 활성
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: false,
  });
  app.useStaticAssets(join(__dirname, '../dist'));

  //유효성 검사 PIPE
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    //swagger
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`NEST JS API`)
      .setDescription('NEST JS API Authorize')
      .setVersion('1.1')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'Bearer' }, 'access-token')
      .build();

    const swaggerOption: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        defaultModelsExpandDepth: -1,
      },
      customSiteTitle: 'NEST JS API [NEST JS]',
    };
    const document = SwaggerModule.createDocument(app, swaggerConfig, { deepScanRoutes: true });
    SwaggerModule.setup('api-docs', app, document, swaggerOption);
  }

  await app.listen(appPort, '0.0.0.0');
  console.log(`app start port : ${appPort}`);
}
bootstrap();
