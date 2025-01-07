export interface Product {
    id: string;
    title: string;
    sku: string;
    price: number;
    inventory: number;
    description?: string;
    productType: string;
    imageUrl?: string;
    productOptions?: ProductOption[];
    createdDate: string;
    lastUpdated: string;
  }
  
  export interface ProductOption {
    name: string;
    choices: Choice[];
  }
  
  export interface Choice {
    value: string;
    description: string;
  }
  
  export interface CreateProductDto {
    title: string;
    sku?: string;
    price: number;
    inventory: number;
    description?: string;
    productType: string;
    imageUrl?: string;
    productOptions: ProductOption[];
  }
  
  export interface UpdateProductDto {
    title?: string;
    price?: number;
    inventory?: number;
  }
  