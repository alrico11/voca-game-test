import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { pick } from 'src/@utils';
import { PrismaService } from 'src/prisma';
import { XConfig } from '../xconfig';
import { LoginBodyDto, RegisterUserBodyDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: XConfig,
  ) { }
  async login({ body: { email, password } }: { body: LoginBodyDto }) {
    email = email.toLowerCase()
    const user = await this.prisma.user.findFirst({ where: { email: email, deletedAt: null }, })
    if (!user) throw new HttpException({ messsage: 'auth failed' }, HttpStatus.UNAUTHORIZED)
    const match = await compare(password, user.password)
    if (!match) throw new HttpException({ message: 'auth failed' }, HttpStatus.UNAUTHORIZED)
    const token = sign({ id: user.id }, this.config.env.USER_JWT_SECRET, {})
    await this.prisma.userToken.create({
      data: { userId: user.id, token }
    })
    return {
      message: 'logged in',
      data: {
        ...pick(user, ['id', 'name', 'email', 'createdAt']),
        token: token
      }
    }
  }

  async register({ confirmPassword, email, name, password }: RegisterUserBodyDto) {
    const existUser = await this.prisma.user.findFirst({ where: { email, deletedAt: null } })
    if (existUser) throw new HttpException('user with this email already exist', HttpStatus.CONFLICT)
    if (confirmPassword !== password) throw new HttpException('password not match', HttpStatus.BAD_REQUEST)

    const user = await this.prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: await hash(password, 12),
      },
    })
    const token = sign({ id: user.id }, this.config.env.USER_JWT_SECRET, {})
    await this.prisma.userToken.create({
      data: { userId: user.id, token }
    })
    return {
      message: "user created",
      token
    }
  }
}
