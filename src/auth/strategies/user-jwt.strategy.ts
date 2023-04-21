import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { AuthService } from '@api/auth/auth.service';
import { ConfigService } from '@nestjs/config';
//import { fabMberDto } from '@api/fab-mber/dto/fab-mber.dto';
import * as moment from 'moment';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * user token 정보 인증 (DB)
   * @param payload
   */
  async validate(req, user) {
    try {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      /*
      const expDate = moment(exp * 1000).format('YYYY.MM.DD HH:mm:ss');
      console.log(
        `JWT Strategy validate start .... sub: ${sub} // mber_id: ${mber_id}`,
        //user,
        expDate,
        exp,
        //this.configService.get<string>('JWT_JTI'),
      );
      const mber: fabMberDto = await this.authService.userJWTValidate(mberId, ip);
      if (!mber) {
        throw new UnauthorizedException({
          status_code: '0103005',
          message: '엑세스 토큰 올바르지 않습니다.',
        });
      }
      */

      return null;
    } catch (e) {
      throw e;
    }
  }
}
