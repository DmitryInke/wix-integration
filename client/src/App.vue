<template>
  <div>
    <h1>Wix Product Integration</h1>
    <div class="actions">
      <button @click="showCreateModal = true" class="btn btn-primary">
        Create Product
      </button>
      <button @click="syncProducts" class="btn btn-success">
        Sync Products from Wix
      </button>
      <button
        :disabled="!selectedProductIds.length"
        :class="{
          'btn btn-disabled': !selectedProductIds.length,
          'btn btn-danger': selectedProductIds.length,
        }"
        @click="deleteSelectedProducts"
      >
        Delete Selected Products
      </button>
    </div>

    <!-- Product Table -->
    <ProductTable
      :products="products"
      :selectedProductIds="selectedProductIds"
      @editProduct="openEditModal"
      @deleteProduct="deleteSingleProduct"
      @selectProducts="updateSelectedProducts"
    />

    <!-- Create Product Modal -->
    <CreateProductModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @submit="createProduct"
    />

    <!-- Edit Product Modal -->
    <EditProductModal
      v-if="showEditModal && selectedProduct"
      :product="selectedProduct"
      @close="showEditModal = false"
      @submit="updateProduct"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductTable from "./components/ProductTable.vue";
import CreateProductModal from "./components/CreateProductModal.vue";
import EditProductModal from "./components/EditProductModal.vue";
import productService from "./services/productService";
import type {
  CreateProductDto,
  Product,
  UpdateProductDto,
} from "./types/product";

export default defineComponent({
  components: { ProductTable, CreateProductModal, EditProductModal },
  data() {
    return {
      products: [] as Product[],
      showCreateModal: false,
      showEditModal: false,
      selectedProduct: {} as Partial<Product>,
      selectedProductIds: [] as string[],
    };
  },
  methods: {
    async syncProducts() {
      await productService.syncProducts();
      this.loadProducts();
    },
    async createProduct(newProduct: CreateProductDto) {
      await productService.createProduct(newProduct);
      this.loadProducts();
      this.showCreateModal = false;
    },
    async updateProduct(updatedProduct: Partial<Product>) {
      const { id, ...payload } = updatedProduct;
      payload.price = Number(payload.price);
      payload.inventory = Number(payload.inventory);
      await productService.updateProduct(
        id as string,
        payload as UpdateProductDto
      );
      this.loadProducts();
      this.showEditModal = false;
    },
    async deleteSingleProduct(productId: string) {
      await productService.deleteProduct(productId);
      this.loadProducts();
    },
    async deleteSelectedProducts() {
      await productService.deleteProducts(this.selectedProductIds);
      this.selectedProductIds = [];
      this.loadProducts();
    },
    updateSelectedProducts(selectedIds: string[]) {
      this.selectedProductIds = selectedIds;
    },
    async loadProducts() {
      this.products = await productService.getAllProducts();
      this.products = this.products.sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    },
    openEditModal(product: Product) {
      this.selectedProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        inventory: product.inventory,
      };
      this.showEditModal = true;
    },
  },
  mounted() {
    this.loadProducts();
  },
});
</script>

<style src="./style.css"></style>
