import { createZodDto } from "@anatine/zod-nestjs";
import { safeString } from "src/@types";
import { z } from "zod";

export const TransactionCreateBodyDtoSchema = z.object({
  productId: safeString,
  qty: z.number(),
})

export class TransactionCreateBodyDto extends createZodDto(TransactionCreateBodyDtoSchema) { }