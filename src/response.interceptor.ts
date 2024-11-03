import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') data = this.removeNullValues(data)
        return data
      }),
    );
  }

  removeNullValues(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeNullValues(item)).filter((item) => item !== null);
    } else if (typeof obj === 'object' && obj !== null && !(obj instanceof Date)) {
      const result: any = {};
      for (const key in obj) {
        const value = this.removeNullValues(obj[key]);
        if (value !== null) result[key] = value;
      }
      return result;
    } else return obj
  }
}
