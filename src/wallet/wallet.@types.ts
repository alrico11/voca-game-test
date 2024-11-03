import { User } from "@prisma/client";
import { HistoryWalletQueryDto, WalletDepositBodyDto, WalletWithdrawalBodyDto } from "./wallet.dto";

export interface WalletWithdrawal {
  body: WalletWithdrawalBodyDto
  user: User
}

export interface WalletDeposit {
  body: WalletDepositBodyDto
  user: User
}

export interface HistoryWallet {
  query: HistoryWalletQueryDto
  user: User
}