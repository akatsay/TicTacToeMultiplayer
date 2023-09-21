import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product-dto';
import { ProductsService, IProduct } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  @HttpCode(HttpStatus.I_AM_A_TEAPOT)
  getAll(): IProduct[] {
    return this.productsService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: number): IProduct {
    return this.productsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOne(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createOne(createProductDto);
  }
}
