import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { User, Wallet } from '@prisma/client';
import { UserInstance, WalletInstance } from 'src/@decorators';
import { JwtGuard, WalletGuard } from 'src/@guards';
import { TransactionCreateBodyDto } from './transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
@UseGuards(JwtGuard, WalletGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() body: TransactionCreateBodyDto, @UserInstance() user: User, @WalletInstance() wallet: Wallet) {
    return this.transactionService.create({ body, user, wallet });
  }
}
