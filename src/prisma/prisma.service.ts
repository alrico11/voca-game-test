import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { XConfig } from 'src/xconfig';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(readonly config: XConfig) {
    super({ datasources: { db: { url: config.env.DATABASE_URL } } })
  }
  async onModuleInit() { await this.$connect() }
}

