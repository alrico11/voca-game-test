import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma';
import { HistoryWallet, WalletDeposit, WalletWithdrawal } from './wallet.@types';

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService
  ) { }
  async checkBalance(user: User) {
    const wallet = await this.findByUser(user)
    return {
      message: "wallet fetched",
      data: wallet,
    }
  }

  async create(user: User) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { userId: user.id }
    })

    if (!wallet) {
      await this.prisma.$transaction(async (prisma) => {
        const wallet = await prisma.wallet.create({ data: { userId: user.id } })
        await prisma.user.update({ where: { id: user.id }, data: { walletId: wallet.id } })
      })
      return {
        message: 'wallet created',
      }
    }
    else throw new HttpException('wallet already exist', HttpStatus.CONFLICT)
  }

  async withdrawal({ body: { withdrawal }, user }: WalletWithdrawal) {
    let wallet = await this.findByUser(user)
    if (wallet.balance < withdrawal) throw new HttpException('insufficient balance', HttpStatus.BAD_REQUEST)

    const trx = {
      withdrawal,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - withdrawal
    }
    await this.prisma.$transaction(async (prisma) => {
      wallet = await prisma.wallet.update({
        where: { userId: user.id },
        data: { balance: { decrement: withdrawal } }
      })

      await prisma.transaction.create({
        data: {
          transactionType: 'WITHDRAWAL',
          userId: user.id,
          walletId: wallet.id,
          trx
        }
      })
    })
    return {
      message: 'withdrawal successfully',
      wallet
    }
  }

  async deposit({ body: { balance }, user }: WalletDeposit) {
    let wallet = await this.findByUser(user)
    const trx = {
      deposit: balance,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance + balance
    }
    await this.prisma.$transaction(async (prisma) => {
      wallet = await prisma.wallet.update({
        where: { userId: user.id },
        data: { balance: { increment: balance } }
      })
      await prisma.transaction.create({
        data: {
          transactionType: 'DEPOSIT',
          userId: user.id,
          walletId: wallet.id,
          trx
        }
      })
    })
    return {
      message: 'deposit successfully',
      wallet
    }
  }

  async findByUser(user: User) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        userId: user.id,
        deletedAt: null
      }
    })
    if (!wallet) throw new HttpException('wallet not found', HttpStatus.NOT_FOUND)
    return wallet
  }

  async history({ query: { endDate, limit, page, sort, sortBy, startDate, filter }, user }: HistoryWallet) {
    const wallet = await this.findByUser(user)
    const where: Prisma.TransactionWhereInput = {
      userId: user.id,
      deletedAt: null,
      transactionType: filter ?? undefined,
      walletId: wallet.id,
      createdAt: startDate || endDate ? {
        ...(startDate && { gte: dayjs(startDate).startOf('d').toDate() }),
        ...(endDate ? { lte: dayjs(endDate).endOf('d').toDate() } : { lte: dayjs().endOf('d').toDate() }),
      } : undefined,
    }
    const count = await this.prisma.transaction.count({ where })
    const lastPage = Math.ceil(count / limit)
    const data = await this.prisma.transaction.findMany({
      where,
      take: limit,
      skip: limit * (page - 1),
      orderBy: { [sortBy]: sort }
    })
    return {
      message: 'histories fetched',
      data,
      count,
      lastPage,
      limit,
      page
    }
  }
}
