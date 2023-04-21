import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserJwtStrategy } from './strategies/user-jwt.strategy';
import { UserLocalStrategy } from './strategies/user-local.strategy';
import { MberRepositroy } from './repository/mber.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          jwtid: configService.get('JWT_JTI'),
          algorithm: configService.get('JWT_ALGO'),
          expiresIn: `${configService.get('JWT_TTL')}`,
        },
        verifyOptions: {
          algorithms: [configService.get('JWT_ALGO')],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserJwtStrategy, UserLocalStrategy, MberRepositroy],
})
export class AuthModule {}
