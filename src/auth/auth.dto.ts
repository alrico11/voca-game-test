import { createZodDto } from '@anatine/zod-nestjs'
import { safeString } from 'src/@types'
import { zBaseResponse } from 'src/@utils'
import { z } from 'zod'

const LoginBodyDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const LogoutBodySchema = z.object({})
export class LoginBodyDto extends createZodDto(LoginBodyDtoSchema) { }
export class LogoutBodyDto extends createZodDto(LogoutBodySchema) { }

const LoginResponseDtoSchema = zBaseResponse.extend({
  data: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.string(),
    token: z.string(),
  })
})
const LogoutResponseDtoSchema = zBaseResponse
export class LoginResponseDto extends createZodDto(LoginResponseDtoSchema) { }
export class LogoutResponseDto extends createZodDto(LogoutResponseDtoSchema) { }

export const RegisterUserBodyDtoSchema = z.object({
  name: safeString,
  email: z.string().email(),
  password: safeString,
  confirmPassword: safeString
})

export class RegisterUserBodyDto extends createZodDto(RegisterUserBodyDtoSchema) { }