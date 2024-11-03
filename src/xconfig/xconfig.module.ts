import { Global, Module } from '@nestjs/common';
import { XConfig } from './xconfig.service';
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true
      validate: XConfig.validate,
    })
  ],
  providers: [XConfig],
  exports: [XConfig]
})
export class XConfigModule { }
