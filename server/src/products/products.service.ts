import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product-dto';

export interface IProduct {
  id: number;
  name: string;
  price: number;
}
@Injectable()
export class ProductsService {
  private products: IProduct[] = [];

  getAll() {
    return this.products;
  }

  getById(id: number) {
    return this.products.find((p) => p.id === id);
  }

  createOne(productDto: CreateProductDto) {
    this.products.push({
      ...productDto,
      id: Date.now(),
    });
  }
}
