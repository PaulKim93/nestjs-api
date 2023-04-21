import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from '@app/share/modules/filter/all-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { mysqlConection } from '@app/share/modules/db/mysql-connection';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
@Module({
  imports: [
    //config 설정
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV || ''}.env`,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'stage').required(),
        API_PORT: Joi.number().default(3000),
        DATABASE_TYPE: Joi.string(),
        DATABASE_HOST: Joi.string(),
        DATABASE_USER: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_PORT: Joi.string(),
        DATABASE_NAME: Joi.string(),
        JWT_SECRET: Joi.string(),
        JWT_TTL: Joi.number().default(60),
        JWT_REFRESH_TTL: Joi.number().default(600),
        JWT_ALGO: Joi.string(),
        JWT_JTI: Joi.string(),
      }),
      validationOptions: {
        //allowUnknown: false, //환경 변수에 알 수 없는 키를 허용할지 여부를 제어
        abortEarly: true, //true인 경우 첫 번째 오류에서 유효성 검사를 중지합니다. false인 경우 모든 오류를 반환
      },
    }),
    mysqlConection,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
