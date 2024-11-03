import { User } from '@prisma/client';
import z from 'zod';
import { zEnvSchema } from '../@utils';

export { ServiceAccount } from 'firebase-admin';
export type AnyObject = { [key: string]: any }
export const SortEnum = ['asc', 'desc'] as const
export type Entities = [User]
export interface AuthenticatedDto { user: User }
export type Env = z.infer<typeof zEnvSchema>

export const safeString = z.string().transform((val) => val.trim());