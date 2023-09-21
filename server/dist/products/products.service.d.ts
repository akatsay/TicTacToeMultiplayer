import { CreateProductDto } from './dto/create-product-dto';
export interface IProduct {
    id: number;
    name: string;
    price: number;
}
export declare class ProductsService {
    private products;
    getAll(): IProduct[];
    getById(id: number): IProduct;
    createOne(productDto: CreateProductDto): void;
}
