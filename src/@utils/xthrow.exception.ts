import { HttpException, HttpExceptionOptions, HttpStatus } from "@nestjs/common"

export type HttpCode = typeof HttpStatus[keyof typeof HttpStatus];
export const xthrow = (message: string, code: HttpCode = 400) => { throw new HttpException(message, code) }
