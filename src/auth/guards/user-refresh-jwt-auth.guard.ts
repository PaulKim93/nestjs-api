import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment';
@Injectable()
export class UserRefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (info) {
      const { expiredAt = null } = info;
      //jwt expired 오류 확인
      if (expiredAt !== null) {
        const expDate = moment(expiredAt).format('YYYY.MM.DD HH:mm:ss');
        console.log('TokenExpiredError.jwt expired:::', expDate);
      }
    }
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          status_code: '0103001',
          message: 'refresh-token 만료되었습니다.',
        })
      );
    }
    return user;
  }
}
