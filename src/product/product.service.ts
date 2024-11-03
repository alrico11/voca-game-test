import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma';
import { CreateProduct, FindAllProduct, RemoveProduct, UpdateProduct } from './product.@types';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  async create({ body: { availability, description, name, price } }: CreateProduct) {
    await this.prisma.product.create({
      data: { availability, name, price, description }
    })
    return {
      message: "product created",
    }
  }

  async findAll({ query: { limit, page, search, sort, sortBy } }: FindAllProduct) {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      name: search && { contains: search, mode: 'insensitive' }
    }
    const count = await this.prisma.product.count({ where })
    const lastPage = Math.ceil(count / limit)
    const data = await this.prisma.product.findMany({
      where,
      orderBy: { [sortBy]: sort },
      take: limit,
      skip: limit * (page - 1),
    })
    return {
      message: "product fetched",
      data,
      count,
      page,
      limit,
      lastPage
    }
  }

  async update({ body, param: { id } }: UpdateProduct) {
    await this.findById({ id })
    const data = await this.prisma.product.update({
      where: { id },
      data: body
    })
    return {
      message: "product updated",
      code: HttpStatus.OK,
      data
    }
  }

  async remove({ param: { id } }: RemoveProduct) {
    await this.findById({ id })
    const data = await this.prisma.product.update({
      where: { id },
      data: { deletedAt: dayjs().toDate() }
    })
    return {
      message: "product removed",
      data
    };
  }

  async findById({ id }: { id: string }) {
    const productExist = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    })
    if (!productExist) throw new HttpException('product not found', 404)
    return productExist
  }
}
