import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from "@nestjs/schedule";
import { SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from './auth';
import { PrismaModule } from './prisma';
import { ProductModule } from './product';
import { TransactionModule } from './transaction';
import { WalletModule } from './wallet';
import { XConfigModule } from "./xconfig";

export const ImportModules = [
  XConfigModule,
  ScheduleModule.forRoot(),
  EventEmitterModule.forRoot({
    maxListeners: 3000,
    verboseMemoryLeak: true
  }),
  SwaggerModule,
  PrismaModule,
  AuthModule,
  ProductModule,
  WalletModule,
  TransactionModule
]
