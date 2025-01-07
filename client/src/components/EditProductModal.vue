<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Edit Product</h2>
      <form @submit.prevent="handleSubmit">
        <el-form :model="product" label-width="120px">
          <!-- Title -->
          <el-form-item label="Title">
            <el-input v-model="product.title" />
          </el-form-item>

          <!-- Price -->
          <el-form-item label="Price">
            <el-input type="number" v-model.number="product.price" />
          </el-form-item>

          <!-- Inventory -->
          <el-form-item label="Inventory">
            <el-input type="number" v-model.number="product.inventory" />
          </el-form-item>

          <!-- Buttons -->
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">Submit</el-button>
            <el-button type="warning" @click="resetForm">Reset</el-button>
            <el-button @click="$emit('close')" type="default">Cancel</el-button>
          </el-form-item>
        </el-form>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Product } from "../types/product";

export default defineComponent({
  name: "EditProductModal",
  props: {
    product: {
      type: Object as () => Partial<Product>,
      required: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit("submit", this.product);
    },
    resetForm() {
      this.product.title = "";
      this.product.price = 0;
      this.product.inventory = 0;
    },
  },
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
</style>
