import { User, Wallet } from "@prisma/client";
import { TransactionCreateBodyDto } from "./transaction.dto";

export interface CreateTransaction {
  body: TransactionCreateBodyDto
  wallet: Wallet
  user: User
}