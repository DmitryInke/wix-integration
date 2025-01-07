import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post('sync')
  async syncProductsFromWix() {
    return this.productsService.syncProductsFromWix();
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(productId, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') productId: string) {
    return this.productsService.deleteProduct(productId);
  }

  @Delete()
  async deleteProducts(@Body() body: { productIds: string[] }) {
    console.log(body)
    return this.productsService.deleteProducts(body.productIds);
  }
}
