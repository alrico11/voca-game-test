
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma";
import { XConfig } from "src/xconfig";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: XConfig, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.env.USER_JWT_SECRET
    });
  }
  async validate(payload: any, req: Request) {
    const rawToken = req.headers?.authorization?.split(' ')[1];
    const userAuth = await this.prisma.userToken.findFirst({ where: { token: rawToken } })
    if (!userAuth) throw new UnauthorizedException('invalid auth')
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id, deletedAt: null },
      select: { id: true, name: true, email: true, createdAt: true }
    })
    if (!user) throw new UnauthorizedException('user does not exists')
    return user
  }
}
