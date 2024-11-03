import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "@prisma/client";

export const UserInstance = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext): User => {

    const request = ctx.switchToHttp().getRequest()

    return key !== undefined ? request.user[key] : request.user
  }
)
