import { ArgumentsHost, Catch, ExceptionFilter, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import * as moment from 'moment';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger = new Logger('Exception-Filter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const DEFAULT_STATUS_CODE = '9999999';
    //console.log('testtesttesttest-----',exception);
    const { constructor, response, status = HttpStatus.INTERNAL_SERVER_ERROR, error } = exception;

    const resJson = {
      status: false,
      status_code: DEFAULT_STATUS_CODE,
      message: error,
      path: req.url,
      datetime: moment().format('YYYY.MM.DD HH:mm:ss'),
    };

    //error 발생시 status_code, message 처리
    if (response) {
      const { message = error, status_code = DEFAULT_STATUS_CODE } = response;
      //class-validator 처리
      if (Array.isArray(message)) {
        if (message[0].indexOf(':') > -1) {
          const messageArray = message[0].split(':');
          resJson.status_code = messageArray[0];
          resJson.message = messageArray[1];
        } else {
          resJson.message = message[0];
        }
      } else {
        resJson.status_code = status_code;
        resJson.message = message;
      }
    } else {
      resJson.message = exception.message;
    }

    this.logger.error(resJson);
    //console.log(resJson, exception);

    res.status(status).json(resJson);
  }
}
