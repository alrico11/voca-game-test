import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Wallet } from '@prisma/client'; // Adjust the import based on your actual path

export const WalletInstance = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Wallet => {
    const request = ctx.switchToHttp().getRequest();
    return request.wallet; 
  }
);
