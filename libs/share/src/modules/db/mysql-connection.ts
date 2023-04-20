import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

//db
export const mysqlConection = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    bigNumberStrings: false,
    host: configService.get<string>('DATABASE_HOST'),
    port: +configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: ['dist/**/*.entity.{ts,js}'],
    autoLoadEntities: true,
    //synchronize 옵션은 배포 단계에서는 false로 설정해야 합니다. 데이터베이스가 초기화가 진행돼서 데이터가 전부 없어짐
    synchronize: false,
    logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  }),
  inject: [ConfigService],
});
