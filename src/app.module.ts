import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ImportModules } from './app.imports';
import { ZodErrorFilter } from './global.exception';
import { ResponseInterceptor } from './response.interceptor';

@Module({
  imports: ImportModules,
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: ZodErrorFilter },
  ],
})
export class AppModule { }
