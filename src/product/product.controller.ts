import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/@guards';
import { ProductCreateBodyDto, ProductFindAllQueryDto, ProductRemoveParamDto, ProductUpdateBodyDto, ProductUpdateParamDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
@UseGuards(JwtGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: ProductCreateBodyDto) {
    return this.productService.create({ body });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: ProductFindAllQueryDto) {
    return this.productService.findAll({ query });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param() param: ProductUpdateParamDto, @Body() body: ProductUpdateBodyDto) {
    return this.productService.update({ body, param });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param() param: ProductRemoveParamDto) {
    return this.productService.remove({ param });
  }
}
