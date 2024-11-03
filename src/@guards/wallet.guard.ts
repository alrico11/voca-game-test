import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client'; // Import the User type if needed
import { PrismaService } from 'src/prisma'; // Adjust the path as necessary

@Injectable()
export class WalletGuard implements CanActivate {
  constructor(private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    const wallet = await this.prisma.wallet.findFirst({
      where: { userId: user.id, deletedAt: null },
    });

    if (!wallet) throw new HttpException('Create wallet first', HttpStatus.NOT_FOUND);
    request.wallet = wallet;
    return true;
  }
}
