import axios from 'axios';
import type { Product, CreateProductDto, UpdateProductDto } from '../types/product';

const API_URL = 'http://localhost:3000/products';

export default {
  async getAllProducts(): Promise<Product[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },
  async createProduct(productData: CreateProductDto): Promise<Product> {
    const response = await axios.post(API_URL, productData);
    return response.data;
  },
  async updateProduct(productId: string, productData: UpdateProductDto): Promise<Product> {
    const response = await axios.patch(`${API_URL}/${productId}`, productData);
    return response.data;
  },
  async deleteProduct(productId: string): Promise<void> {
    await axios.delete(`${API_URL}/${productId}`);
  },
  async deleteProducts(productIds: string[]): Promise<void> {
    await axios.delete(API_URL, { data: { productIds } });
  },
  async syncProducts(): Promise<void> {
    await axios.post(`${API_URL}/sync`);
  },
};
