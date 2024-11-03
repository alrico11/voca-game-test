import { Injectable } from '@nestjs/common';
import { ZodError, ZodIssue, z } from 'zod';
import { ConfigService } from '@nestjs/config';
import { zEnvSchema } from 'src/@utils';


export type XConfigEnv = z.infer<typeof zEnvSchema>
@Injectable()
export class XConfig {
  public env: XConfigEnv
  public c = { storage: { prefix: '' } }
  constructor(private readonly configService: ConfigService) {
    this.env = new Proxy(({}) as XConfigEnv, {
      get: (_, prop: keyof XConfigEnv) => {
        if (zEnvSchema.keyof()._def.values.includes(prop)) return this.configService.get(prop)
        throw new Error(`Property '${prop}' does not exist in XConfig.`)
      },
    })
  }

  public static validate(env: unknown) {
    try {
      return zEnvSchema.parse(env)
    } catch (error: ZodError | unknown) {
      let errors: ZodIssue[]
      if (error instanceof ZodError) {
        errors = error.errors
        errors.forEach(({ message, path }) => console.log(path.join(', ')) + ' : ' + message)
      }
      console.error(error)
      // process.exit(1)
      throw new Error('env validation failed')
    }
  }
}
