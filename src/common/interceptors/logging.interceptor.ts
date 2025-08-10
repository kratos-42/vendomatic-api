import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

import { TIMEOUT_KEY } from '@common/constants/log.constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  private readonly defaultTimeoutMillis = 30000;

  constructor(private readonly reflector?: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const timeoutMs = this.getTimeout(context);
    const { operationDetails, operationName } = this.getOperationDetails(context);

    this.logger.log(`${operationName} starting`);

    // TODO: add sanitization/mask for request, response and error data
    this.logger.log(operationDetails);

    return next.handle().pipe(
      timeout(timeoutMs),
      tap({
        error: (error) => {
          const duration = Date.now() - startTime;

          this.logger.error(`${operationName} failed after ${duration}ms: ${error}`);
        },
        next: (response) => {
          const duration = Date.now() - startTime;

          this.logger.log(`${operationName} completed in ${duration}ms`);
          this.logger.debug(response);
        },
      }),
      // TODO: add better error handling to remove sensitive info thay may exist in 500+ errors
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          this.logger.error(`Timeout: ${operationName} exceeded ${timeoutMs}ms`);

          throw new RequestTimeoutException(`Operation timed out after ${timeoutMs}ms`);
        }

        return throwError(() => error);
      }),
    );
  }

  private getTimeout(context: ExecutionContext): number {
    if (!this.reflector) {
      return this.defaultTimeoutMillis;
    }

    return (
      this.reflector.get<number>(TIMEOUT_KEY, context.getHandler()) ??
      this.reflector.get<number>(TIMEOUT_KEY, context.getClass()) ??
      this.defaultTimeoutMillis
    );
  }

  private getOperationDetails(context: ExecutionContext) {
    const contextType = context.getType() as string;

    if (contextType !== 'graphql') {
      return {};
    }

    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();

    return {
      operationDetails: gqlContext.getArgs(),
      operationName: info.fieldName,
    };
  }
}
