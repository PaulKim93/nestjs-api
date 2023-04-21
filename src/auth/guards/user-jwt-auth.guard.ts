import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment';
@Injectable()
export class UserJwtAuthGuard extends AuthGuard('jwt') {
  /*
    getRequest(context: ExecutionContext) {
        //const ctx = GqlExecutionContext.create(context);
        const req = context.switchToHttp().getRequest();;
        return req;
    }
    */

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (info) {
      console.log('JwtAuthGuard-', info);
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
          message: '엑세스 토큰 만료되었습니다.',
        })
      );
    }
    return user;
  }
}
