<template>
  <el-form :model="product" label-width="120px">
    <el-form-item label="Title">
      <el-input v-model="product.title" />
    </el-form-item>
    <el-form-item label="SKU">
      <el-input v-model="product.sku" />
    </el-form-item>
    <el-form-item label="Price">
      <el-input type="number" v-model="product.price" />
    </el-form-item>
    <el-form-item label="Inventory">
      <el-input type="number" v-model="product.inventory" />
    </el-form-item>
    <el-form-item label="Description">
      <el-input v-model="product.description" />
    </el-form-item>
    <el-form-item label="Product Type">
      <el-select v-model="product.productType" placeholder="Select product type">
        <el-option label="Physical" value="physical" />
      </el-select>
    </el-form-item>
    <el-form-item label="Product Options">
      <div v-for="(option, index) in product.productOptions" :key="index">
        <strong>{{ option.name }}:</strong>
        <span v-for="choice in option.choices" :key="choice.value">
          {{ choice.description }}
        </span>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">Submit</el-button>
      <el-button @click="resetForm">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import type { CreateProductDto } from '../types/product';

export default defineComponent({
  name: 'ProductForm',
  props: {
    initialProduct: {
      type: Object as PropType<CreateProductDto>,
      required: false,
    },
  },
  setup(props, { emit }) {
    const product = ref<CreateProductDto>({
      title: props.initialProduct?.title || '',
      sku: props.initialProduct?.sku || '',
      price: props.initialProduct?.price || 0,
      inventory: props.initialProduct?.inventory || 0,
      description: props.initialProduct?.description || '',
      productType: props.initialProduct?.productType || 'physical',
      productOptions: props.initialProduct?.productOptions || [],
    });

    const submitForm = () => {
      emit('submit', product.value);
    };

    const resetForm = () => {
      product.value = {
        title: '',
        sku: '',
        price: 0,
        inventory: 0,
        description: '',
        productType: 'physical',
        productOptions: [],
      };
    };

    return {
      product,
      submitForm,
      resetForm,
    };
  },
});
</script>
