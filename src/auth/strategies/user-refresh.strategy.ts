import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@api/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { DefaultUserDto } from '@api/auth/dto/res.dto';

@Injectable()
export class UserRefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * user token 정보 인증 (DB)
   * @param payload
   */
  async validate(req, user: DefaultUserDto): Promise<DefaultUserDto> {
    try {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const { mber_id } = user;
      const result = await this.authService.userValidate(mber_id);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
