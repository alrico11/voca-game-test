import { createZodDto } from "@anatine/zod-nestjs";
import { Prisma } from "@prisma/client";
import { safeString } from "src/@types";
import { findAllValidation } from "src/@utils";
import { z } from "zod";
const ProductFields = Prisma.ProductScalarFieldEnum

export const ProductCreateBodyDtoSchema = z.object({
  name: safeString,
  description: safeString.optional(),
  price: z.number(),
  availability: z.number()
})
export class ProductCreateBodyDto extends createZodDto(ProductCreateBodyDtoSchema) { }

export const ProductUpdateParamDtoSchema = z.object({ id: z.string() })
export const ProductUpdateBodyDtoSchema = ProductCreateBodyDtoSchema.partial()
export class ProductUpdateParamDto extends createZodDto(ProductUpdateParamDtoSchema) { }
export class ProductUpdateBodyDto extends createZodDto(ProductUpdateBodyDtoSchema) { }

export const ProductFindAllQueryDtoSchema = findAllValidation
export class ProductFindAllQueryDto extends createZodDto(ProductFindAllQueryDtoSchema) { }

export const ProductRemoveParamDtoSchema = ProductUpdateParamDtoSchema
export class ProductRemoveParamDto extends createZodDto(ProductRemoveParamDtoSchema) { }