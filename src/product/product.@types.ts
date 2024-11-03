import { ProductCreateBodyDto, ProductFindAllQueryDto, ProductRemoveParamDto, ProductUpdateBodyDto, ProductUpdateParamDto } from "./product.dto";

export interface CreateProduct {
  body: ProductCreateBodyDto
}

export interface FindAllProduct {
  query: ProductFindAllQueryDto
}

export interface UpdateProduct {
  param: ProductUpdateParamDto
  body: ProductUpdateBodyDto
}

export interface RemoveProduct {
  param: ProductRemoveParamDto
}