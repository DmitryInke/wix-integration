import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WixApiService } from '../wix-api/wix-api.service';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly wixProductApiUrl =
    'https://www.wixapis.com/stores/v1/products';
  private readonly wixProductInventoryApiUrl =
    'https://www.wixapis.com/stores/v2/inventoryItems';

  constructor(
    private prisma: PrismaService,
    private wixApiService: WixApiService,
    private cacheService: RedisCacheService,
  ) {}

  private generateRandomSKU(): string {
    return Math.floor(Math.random() * 10_000_000_00)
      .toString()
      .padStart(10, '0');
  }

  async getAllProducts() {
    const cacheKey = 'all-products';
    const cachedProducts = await this.cacheService.get(cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.prisma.product.findMany();
    await this.cacheService.set(cacheKey, products, 60); // Cache for 60 seconds
    return products;
  }

  async syncProductsFromWix() {
    const productsResponse = await this.wixApiService.post<{ products: any[] }>(
      `${this.wixProductApiUrl}/query`,
      { query: { sort: '[{"numericId": "asc"}]' } },
      'Failed to sync products from Wix',
    );

    const wixProducts = productsResponse.products || [];
    const wixProductIds = wixProducts.map((product) => product.id);

    await this.prisma.product.deleteMany({
      where: { id: { notIn: wixProductIds } },
    });

    const syncedProducts = [];
    for (const wixProduct of wixProducts) {
      const imageUrl = wixProduct.media?.mainMedia?.thumbnail?.url || null;
      const inventory = wixProduct.stock.trackInventory
        ? `${wixProduct.stock.quantity}`
        : wixProduct.stock.inventoryStatus;
      const sku = wixProduct.sku || this.generateRandomSKU();

      const product = await this.prisma.product.upsert({
        where: { id: wixProduct.id },
        update: {
          inventoryItemId: wixProduct.inventoryItemId,
          title: wixProduct.name,
          productType: wixProduct.productType,
          description: wixProduct.description,
          sku: sku,
          price: wixProduct.price.price,
          inventory: inventory,
          productOptions: JSON.stringify(wixProduct.productOptions || []),
          imageUrl: imageUrl,
          lastUpdated: new Date(wixProduct.lastUpdated),
        },
        create: {
          id: wixProduct.id,
          inventoryItemId: wixProduct.inventoryItemId,
          title: wixProduct.name,
          productType: wixProduct.productType,
          description: wixProduct.description,
          sku: sku,
          price: wixProduct.price.price,
          inventory: inventory,
          productOptions: JSON.stringify(wixProduct.productOptions || []),
          imageUrl: imageUrl,
          lastUpdated: new Date(wixProduct.lastUpdated),
          createdDate: new Date(wixProduct.createdDate),
        },
      });

      syncedProducts.push(product);
    }

    await this.cacheService.del('all-products');

    return syncedProducts;
  }

  async createProduct(productData: CreateProductDto) {
    const sku = this.generateRandomSKU();

    const requestBody = {
      product: {
        name: productData.title,
        productType: productData.productType,
        priceData: { price: productData.price },
        description: productData.description,
        sku: sku,
        productOptions: productData.productOptions || [],
      },
    };

    const createdProduct = await this.wixApiService.post<any>(
      this.wixProductApiUrl,
      requestBody,
      'Failed to create product on Wix',
    );
    const createdProductData = createdProduct.product;

    await this.updateProductInventory(
      createdProductData.inventoryItemId,
      createdProductData.variants[0].id,
      productData.inventory,
    );
    if (productData.imageUrl) {
      await this.uploadProductMedia(
        createdProductData.id,
        productData.imageUrl,
      );
    }
    const inventory =
      productData.inventory > 0
        ? `${productData.inventory}`
        : createdProductData.stock.inventoryStatus;

    const product = await this.prisma.product.create({
      data: {
        id: createdProductData.id,
        inventoryItemId: createdProductData.inventoryItemId,
        title: createdProductData.name,
        productType: createdProductData.productType,
        description: createdProductData.description,
        sku: createdProductData.sku,
        price: createdProductData.priceData.price,
        inventory: inventory,
        productOptions: JSON.stringify(createdProductData.productOptions || []),
        imageUrl: productData.imageUrl || null,
        createdDate: new Date(createdProductData.createdDate),
      },
    });

    await this.cacheService.del('all-products');
    return product;
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    const requestBody: any = { product: {} };
    if (updateProductDto.title) {
      requestBody.product.name = updateProductDto.title;
    }
    if (updateProductDto.price !== undefined) {
      requestBody.product.priceData = { price: updateProductDto.price };
    }

    if (Object.keys(requestBody.product).length > 0) {
      const updatedProduct = await this.wixApiService.patch<any>(
        `${this.wixProductApiUrl}/${productId}`,
        requestBody,
        'Failed to update product on Wix',
      );

      if (updateProductDto.inventory !== undefined) {
        await this.updateProductInventory(
          updatedProduct.product.inventoryItemId,
          updatedProduct.product.variants[0].id,
          updateProductDto.inventory,
        );
      }
    }

    const product = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(updateProductDto.title && { title: updateProductDto.title }),
        ...(updateProductDto.price !== undefined && {
          price: updateProductDto.price,
        }),
        ...(updateProductDto.inventory !== undefined && {
          inventory: updateProductDto.inventory + '',
        }),
      },
    });

    await this.cacheService.del('all-products');
    return product;
  }

  async deleteProduct(productId: string) {
    await this.wixApiService.delete(
      `${this.wixProductApiUrl}/${productId}`,
      `Failed to delete product with ID ${productId} on Wix`,
    );

    const product = await this.prisma.product.delete({
      where: { id: productId },
    });

    await this.cacheService.del('all-products');
    return product;
  }

  async deleteProducts(productIds: string[]) {
    await Promise.all(
      productIds.map((productId) =>
        this.wixApiService.delete(
          `${this.wixProductApiUrl}/${productId}`,
          `Failed to delete product with ID ${productId} on Wix`,
        ),
      ),
    );

    await this.prisma.product.deleteMany({
      where: { id: { in: productIds } },
    });

    await this.cacheService.del('all-products');

    return { message: 'Products deleted successfully' };
  }

  async updateProductInventory(
    inventoryItemId: string,
    variantId: string,
    quantity: number,
  ) {
    const requestBody = {
      inventoryItem: {
        trackQuantity: true,
        variants: [{ variantId: variantId, quantity: quantity }],
      },
    };

    await this.wixApiService.patch(
      `${this.wixProductInventoryApiUrl}/${inventoryItemId}`,
      requestBody,
      'Failed to update product inventory on Wix',
    );

    return { message: 'Inventory updated successfully' };
  }

  async uploadProductMedia(productId: string, imageUrl: string) {
    const requestBody = {
      media: [{ url: imageUrl }],
    };

    await this.wixApiService.post(
      `${this.wixProductApiUrl}/${productId}/media`,
      requestBody,
      'Failed to upload product media on Wix',
    );

    return { message: 'Media uploaded successfully' };
  }
}
