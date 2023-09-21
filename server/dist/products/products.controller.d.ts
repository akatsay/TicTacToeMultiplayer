import { CreateProductDto } from './dto/create-product-dto';
import { ProductsService, IProduct } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAll(): IProduct[];
    getOne(id: number): IProduct;
    createOne(createProductDto: CreateProductDto): void;
}
