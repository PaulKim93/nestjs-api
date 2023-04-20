import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, SwaggerCustomOptions } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { express } from 'express-useragent';
import { join } from 'path';
import { GlobalLoggingInterceptor } from '@app/share/modules/interceptor/global-logging.interceptor';
import { winstonLogger } from '@app/share/utils/winston.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });
  app.use(express());
  app.useGlobalInterceptors(new GlobalLoggingInterceptor());
  const appPort: number = app.get(ConfigService).get('API_PORT');

  //CORS 활성
  app.enableCors({
    origin: true, // 나중에 변경
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
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'Bearer' }, 'access-token')
      .build();

    const swaggerOption: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        defaultModelsExpandDepth: -1,
      },
      customSiteTitle: 'NEST JS API',
    };
    const document = SwaggerModule.createDocument(app, swaggerConfig, { deepScanRoutes: true });
    SwaggerModule.setup('api-docs', app, document, swaggerOption);
  }

  await app.listen(appPort, '0.0.0.0');
  console.log(`app start port : ${appPort}`);
}
bootstrap();
