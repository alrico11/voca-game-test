import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(HttpException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  constructor() { }
  catch(exception: HttpException, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse()
      const status = exception.getStatus()
      return response.status(status).json({ statusCode: status, message: status === 500 ? 'Internal server error' : exception.message })
    } catch (error) {
      console.error(error)
    }
  }
}
@Catch(ZodError)
export class ZodErrorFilter implements ExceptionFilter {
  constructor() { }
  catch(zodError: ZodError, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      ctx.getRequest()

      const response = ctx.getResponse();
      const generatedMessage =
        zodError.issues.map(issue => `${issue.path.join(', ')} is ${issue.message}`).join(', ')
      return response.status(400).json({ statusCode: 400, message: generatedMessage })
    } catch (error) {
      console.error(error)
    }
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() { }
  catch(error: Error, host: ArgumentsHost) {
    try {
      const ctx = host?.switchToHttp();
      const response = ctx?.getResponse();

      if (ctx !== undefined && response !== undefined)
        response.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
      console.error(error)
    } catch (error) {
      console.error(error)
    }
  }
}
