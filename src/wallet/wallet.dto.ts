import { createZodDto } from "@anatine/zod-nestjs";
import { TransactionType } from "@prisma/client";
import { findAllValidation } from "src/@utils";
import { z } from "zod";

export const WalletDepositBodyDtoSchema = z.object({
  balance: z.number()
})
export class WalletDepositBodyDto extends createZodDto(WalletDepositBodyDtoSchema) { }

export const WalletWithdrawalBodyDtoSchema = z.object({
  withdrawal: z.number()
})
export class WalletWithdrawalBodyDto extends createZodDto(WalletWithdrawalBodyDtoSchema) { }

export const HistoryWalletQueryDtoSchema = findAllValidation.extend({
  filter: z.nativeEnum(TransactionType).optional()
})
export class HistoryWalletQueryDto extends createZodDto(HistoryWalletQueryDtoSchema) { }