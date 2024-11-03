import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateTransaction } from './transaction.@types';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService
  ) {
  }
  async create({ body: { productId, qty }, user, wallet }: CreateTransaction) {
    const { balance } = wallet
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null }
    })
    if (!product) throw new HttpException('product not found', 404)
    if (product.availability < qty) throw new HttpException(`Please set a lower quantity. Maximum available: ${product.availability}`, HttpStatus.BAD_REQUEST);
    if (product.price * qty > balance) throw new HttpException('insufficient balance', HttpStatus.BAD_GATEWAY)
    const trx = {
      qty,
      total: product.price * qty,
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.product.update({
        where: { id: productId },
        data: { availability: { decrement: qty } }
      })
      await prisma.transaction.create({
        data: { productId, walletId: wallet.id, userId: user.id, trx, transactionType: 'PAYMENT' }
      })
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: product.price * qty } }
      })
    })
    return {
      message: 'transcaction created successfully'
    }
  }
}
