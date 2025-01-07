<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Create Product</h2>
      <form @submit.prevent="handleSubmit">
        <el-form :model="newProduct" label-width="120px">
          <el-form-item label="Title">
            <el-input v-model="newProduct.title" />
          </el-form-item>

          <el-form-item label="Description">
            <el-input v-model="newProduct.description" />
          </el-form-item>

          <el-form-item label="Price">
            <el-input type="number" v-model="newProduct.price" />
          </el-form-item>

          <el-form-item label="Product Type">
            <el-select
              v-model="newProduct.productType"
              placeholder="Select type"
            >
              <el-option label="Physical" value="physical" />
            </el-select>
          </el-form-item>

          <el-form-item label="Image URL">
            <el-input v-model="newProduct.imageUrl" />
          </el-form-item>

          <el-form-item label="Inventory">
            <el-input type="number" v-model="newProduct.inventory" />
          </el-form-item>

          <!-- Product Options Section -->
          <el-form-item label="Product Options">
            <div class="options-container">
              <div
                v-for="(option, index) in newProduct.productOptions"
                :key="index"
                class="option-group"
              >
                <el-tooltip
                  content="Option Name (e.g. Size, Color)"
                  placement="top"
                >
                  <el-input
                    v-model="option.name"
                    placeholder="Option Name (e.g. Size, Color)"
                    class="option-input"
                  />
                </el-tooltip>
                <div
                  v-for="(choice, choiceIndex) in option.choices"
                  :key="choiceIndex"
                  class="choice-group"
                >
                  <el-tooltip
                    content="Choice Value (e.g. S, M, L, #ff0000)"
                    placement="top"
                  >
                    <el-input
                      v-model="choice.value"
                      placeholder="Choice Value (e.g. S, M, L, #ff0000)"
                    />
                  </el-tooltip>
                  <el-tooltip
                    content="Choice Description (e.g. Small, Medium, Red)"
                    placement="top"
                  >
                    <el-input
                      v-model="choice.description"
                      placeholder="Choice Description (e.g. Small, Medium, Red)"
                    />
                  </el-tooltip>
                  <el-button
                    type="danger"
                    @click="removeChoice(index, choiceIndex)"
                  >
                    Remove Choice
                  </el-button>
                </div>
                <el-button type="primary" @click="addChoice(index)"
                  >Add Choice</el-button
                >
              </div>
              <el-button type="success" @click="addOption"
                >Add Option</el-button
              >
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">Submit</el-button>
            <el-button type="warning" @click="resetForm">Reset</el-button>
            <el-button type="default" @click="$emit('close')">Cancel</el-button>
          </el-form-item>
        </el-form>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import type { CreateProductDto } from "../types/product";

export default defineComponent({
  emits: ["submit", "close"],
  setup(_, { emit }) {
    const newProduct = reactive<CreateProductDto>({
      title: "",
      description: "",
      price: 0,
      productType: "physical",
      imageUrl: "",
      inventory: 0,
      productOptions: [],
    });

    const addOption = () => {
      newProduct.productOptions.push({ name: "", choices: [] });
    };

    const addChoice = (optionIndex: number) => {
      newProduct.productOptions[optionIndex].choices.push({
        value: "",
        description: "",
      });
    };

    const removeChoice = (optionIndex: number, choiceIndex: number) => {
      newProduct.productOptions[optionIndex].choices.splice(choiceIndex, 1);
    };

    const handleSubmit = () => {
      newProduct.price = Number(newProduct.price);
      newProduct.inventory = Number(newProduct.inventory);
      emit("submit", newProduct);
    };

    const resetForm = () => {
      newProduct.title = "";
      newProduct.description = "";
      newProduct.price = 0;
      newProduct.productType = "physical";
      newProduct.imageUrl = "";
      newProduct.inventory = 0;
      newProduct.productOptions = [];
    };

    return {
      newProduct,
      addOption,
      addChoice,
      removeChoice,
      handleSubmit,
      resetForm,
    };
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
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-group {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.choice-group {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.option-input {
  margin-bottom: 5px;
}
</style>
