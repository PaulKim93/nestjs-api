import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from '@app/share/modules/filter/all-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { mysqlConection } from '@app/share/modules/db/mysql-connection';

@Module({
  imports: [
    //config 설정
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV || ''}.env`,
      isGlobal: true,
    }),
    mysqlConection,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
