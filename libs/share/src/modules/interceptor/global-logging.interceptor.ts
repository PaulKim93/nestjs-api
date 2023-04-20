import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
//import { PrivacyReplacer } from './PrivacyReplacer';
//import { clone } from 'ramda';
import * as moment from 'moment';
@Injectable()
export class GlobalLoggingInterceptor implements NestInterceptor {
  private requestLogger = new Logger('HTTP_REQUEST');
  private responseLogger = new Logger('HTTP_RESPONSE');
  private errorLogger = new Logger('HTTP_ERROR');
  /*
  constructor(
    //@Inject('LOGGING_IGNORE_PATH') private readonly loggingIgnorePath: string[], //private readonly privacyReplacer: PrivacyReplacer,
  ) {}
  */

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //console.log(request);
    const executionId = uuid();
    this.logRequest(context, executionId);

    return next.handle().pipe(
      catchError((error: any) => {
        this.logResponse(context, executionId, error);
        throw error;
      }),
      tap((data) => {
        this.logResponse(context, executionId, data);
      }),
    );
  }

  private logResponse(context: ExecutionContext, executionId: string, data: any) {
    const response = context.switchToHttp().getResponse<Response>();
    const loggingParams: Record<string, any> = {
      executionId,
      user: this.getUser(context),
      headers: response.header,
      datetime: moment().format('YYYY.MM.DD HH:mm'),
    };
    if (data instanceof Error) {
      loggingParams.error = data;
      this.responseLogger.error(JSON.stringify(loggingParams));
    } else {
      loggingParams.body = data;
      this.responseLogger.log(JSON.stringify(loggingParams));
    }

    this.responseLogger.log(JSON.stringify(loggingParams));
  }

  private logRequest(context: ExecutionContext, executionId: string) {
    const request = context.switchToHttp().getRequest<Request>();
    this.requestLogger.log(
      JSON.stringify({
        executionId,
        user: this.getUser(context),
        path: request.path,
        body: request.body,
        headers: request.headers,
        datetime: moment().format('YYYY.MM.DD HH:mm'),
      }),
    );
  }
  private getUser(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.user == null || typeof request.user !== 'object') {
      return null;
    }

    const user = { ...request.user };
    delete user.password;

    return user;
  }
}
