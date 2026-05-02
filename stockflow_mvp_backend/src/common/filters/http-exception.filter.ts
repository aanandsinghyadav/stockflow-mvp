import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';
    let errors: Record<string, string> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as any;

        // class-validator sends { message: string[] } for validation errors
        if (Array.isArray(res.message)) {
          message = 'Validation failed';
          errors = res.message.reduce(
            (acc: Record<string, string>, msg: string) => {
              // msg format: "fieldName must be ..."
              const field = msg.split(' ')[0];
              acc[field] = msg;
              return acc;
            },
            {},
          );
        } else {
          message = res.message ?? message;
        }
      }
    }

    response.status(status).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
      ...(errors && { errors }),
    });
  }
}
