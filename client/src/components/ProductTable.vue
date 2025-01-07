<template>
  <table>
    <thead>
      <tr>
        <th>
          <input type="checkbox" :checked="allSelected" @change="selectAll" />
        </th>
        <th>Image</th>
        <th>Title</th>
        <th>SKU</th>
        <th>Price</th>
        <th>Inventory</th>
        <th>Description</th>
        <th>Product Type</th>
        <th>Variation Attribute</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>
          <input
            type="checkbox"
            :value="product.id"
            :checked="selectedProductIds.includes(product.id)"
            @change="selectProduct"
          />
        </td>
        <td><img :src="product.imageUrl" alt="Product Image" /></td>
        <td>{{ product.title }}</td>
        <td>{{ product.sku }}</td>
        <td>₪{{ product.price }}</td>
        <td>{{ product.inventory }}</td>
        <td>{{ product.description }}</td>
        <td>{{ product.productType }}</td>
        <td>
          <div v-if="product.productOptions && product.productOptions.length">
            <div
              v-for="(option, index) in formatOptions(product.productOptions)"
              :key="index"
            >
              <label>{{ option.name }}:</label>
              <select>
                <option
                  v-for="(choice, idx) in option.choices"
                  :key="idx"
                  :value="choice.value"
                >
                  {{ choice.description }}
                </option>
              </select>
            </div>
          </div>
          <div v-else>None</div>
        </td>
        <td class="actions">
          <button
            @click="$emit('editProduct', product)"
            class="btn btn-primary"
          >
            Edit
          </button>
          <button
            @click="$emit('deleteProduct', product.id)"
            class="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Product, ProductOption } from "../types/product";

export default defineComponent({
  props: {
    products: {
      type: Array as PropType<Product[]>,
      required: true,
    },
    selectedProductIds: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  computed: {
    allSelected(): boolean {
      return (
        this.selectedProductIds.length > 0 &&
        this.selectedProductIds.length === this.products.length
      );
    },
  },
  methods: {
    formatOptions(options: string | ProductOption[]) {
      if (typeof options === "string") {
        try {
          return JSON.parse(options);
        } catch (error) {
          console.error("Error parsing product options:", error);
          return [];
        }
      }
      return options;
    },
    selectProduct(event: Event) {
      const checkbox = event.target as HTMLInputElement;
      const productId = checkbox.value;

      this.$emit(
        "selectProducts",
        checkbox.checked
          ? [...this.selectedProductIds, productId]
          : this.selectedProductIds.filter((id) => id !== productId)
      );
    },
    selectAll(event: Event) {
      const checkbox = event.target as HTMLInputElement;
      this.$emit(
        "selectProducts",
        checkbox.checked ? this.products.map((product) => product.id) : []
      );
    },
  },
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  position: sticky;
  top: 0;
  background-color: #f9f9f9;
  z-index: 2;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
