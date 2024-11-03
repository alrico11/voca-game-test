import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserInstance } from 'src/@decorators';
import { JwtGuard } from 'src/@guards';
import { HistoryWalletQueryDto, WalletDepositBodyDto, WalletWithdrawalBodyDto } from './wallet.dto';
import { WalletService } from './wallet.service';

@UseGuards(JwtGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@UserInstance() user: User) {
    return this.walletService.create(user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  checkBalance(@UserInstance() user: User) {
    return this.walletService.checkBalance(user);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  history(@Query() query: HistoryWalletQueryDto, @UserInstance() user: User) {
    return this.walletService.history({ query, user });
  }

  @Post('withdrawal')
  @HttpCode(HttpStatus.OK)
  withdrawal(@Body() body: WalletWithdrawalBodyDto, @UserInstance() user: User) {
    return this.walletService.withdrawal({ body, user });
  }
  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  deposit(@Body() body: WalletDepositBodyDto, @UserInstance() user: User) {
    return this.walletService.deposit({ body, user });
  }
}
