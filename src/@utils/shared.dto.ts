import { SortEnum } from 'src/@types'
import z, { EnumLike } from 'zod'

interface findAllValidationFactoryArgs {
  orderBy: EnumLike
}

export const findAllValidationFactory = ({ orderBy }: findAllValidationFactoryArgs) => z.object({
  page: z.number({ coerce: true }).optional().default(1),
  search: z.string().optional(),
  sort: z.enum(SortEnum).optional().default('desc'),
  sortBy: z.nativeEnum(orderBy).optional().default('createdAt'),
  limit: z.number({ coerce: true }).optional().default(10),
})

export const findAllValidation = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number({ coerce: true }).optional().default(1),
  search: z.string().optional(),
  sort: z.enum(SortEnum).optional().default('desc'),
  sortBy: z.string().optional().default('createdAt'),
  limit: z.number({ coerce: true }).optional().default(10)
})

export const zBaseResponse = z.object({ message: z.string() })
export const zPaginateResponse = zBaseResponse.extend({
  page: z.number(),
  lastPage: z.number(),
  limit: z.number(),
  count: z.number()
})
