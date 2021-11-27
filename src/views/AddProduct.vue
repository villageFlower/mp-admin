<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> Product </el-breadcrumb-item>
        <el-breadcrumb-item>Add Product</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="wide-form-box">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="180px">
          <el-form-item label="Product Name" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="Original Price" prop="original_price">
            <el-input v-model="form.original_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="Current Price" prop="price">
            <el-input v-model="form.price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="Publish" prop="published">
            <el-switch v-model="form.published"></el-switch>
          </el-form-item>
          <el-form-item label="Stock" prop="stock">
            <el-input-number size="mini" v-model="form.stock" :min="0" label="Current Stock"></el-input-number>
          </el-form-item>
          <el-form-item label="Product Images" prop="images">
            <el-upload class="upload-demo" res="upload" drag multiple :limit="8" action="https://mp-api.simonyc.tech/api/upload-image" :on-change="onImageChange" list-type="picture">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                You can drag image here or
                <em>Click to upload</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">Only images with jpg/png extension are accepted</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="Category" prop="category_id">
            <el-select v-model="form.category_id" placeholder="Please Select Category">
              <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Product Description" prop="category">
            <TextEditor v-model="form.detail" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">Submit</el-button>
            <el-button @click="onReset">Reset form</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { api } from "../api/index";
import { useRouter } from "vue-router";
import TextEditor from "../components/TextEditor.vue";
export default {
  name: "baseform",
  components: {
    TextEditor,
  },
  data() {
    return {
      form: {
        name: "",
        original_price: "0",
        price: "",
        published: true,
        detail: "",
        stock: 0,
        category_id: "",
        images: [],
      },
      rules: {
        name: [{ required: true, message: "Product Name Cannot Be Empty", trigger: "blur" }],
        original_price: [{ required: true, message: "Original Price cannot be Empty, System will ignore if set to 0", trigger: "blur" }],
        price: [{ required: true, message: "Price cannot be Empty", trigger: "blur" }],
        category_id: [{ required: true, message: "Please select a category", trigger: "blur" }],
      },
      categories: "",
      imageList: [],
    };
  },
  async created() {
    let res = await api.getAllCategories();
    console.log(res);
    this.categories = res.data;
  },
  methods: {
    onImageChange(file, fileList) {
      console.log(fileList);
      this.imageList = fileList;
    },
    onReset() {
      this.$refs["formRef"].resetFields();
    },
    onSubmit() {
      // 表单校验
      this.$refs["formRef"].validate(async (valid) => {
        if (valid) {
          if (this.imageList.length < 1) return ElMessage.error("Please upload at least one image");
          this.imageList.forEach((image) => {
            this.form.images.push(image.response.id);
          });
          console.log(this.form);
          let res = await api.addProduct(this.form);
          if (res.status != 200) {
            this.form.images = []
            return ElMessage.error("Server error, Please Contact IT Department");
          }
          console.log(res);
          ElMessage.success("Uploaded");
          this.$refs.upload.clearFiles();
          this.form = {
            name: "",
            original_price: "0",
            price: "",
            published: true,
            detail: "",
            stock: 0,
            category_id: "",
            images: [],
          };
        } else {
          return false;
        }
      });
    },
  },
};
</script>
