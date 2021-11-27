<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> Product </el-breadcrumb-item>
        <el-breadcrumb-item>Product Category</el-breadcrumb-item>
        <el-breadcrumb-item>Add Category</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="130px">
          <el-form-item label="Category Name" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="Publish On Add" prop="active">
            <el-switch v-model="form.active"></el-switch>
          </el-form-item>

          <el-form-item label="Category Rank" prop="arrange">
            <el-input-number size="mini" v-model="form.arrange" @change="handleChange" :min="0" label="Catgory displaying priority"></el-input-number>
          </el-form-item>

          <el-form-item label="Icon" prop="image_id">
            <el-upload
              class="upload-demo"
              drag
              :multiple="false"
              :limit="1"
              action="https://mp-api.simonyc.tech/api/upload-image"
              :on-success="onImageUploadSuccess"
              :on-error="onImageUploadError"
              list-type="picture"
            >
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

          <el-form-item>
            <el-button type="primary" @click="onSubmit">Add</el-button>
            <el-button @click="onReset">Reset Form</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { api } from "../api/index";
import { useRouter } from "vue-router";

export default {
  name: "baseform",
  setup() {
    const router = useRouter();
    const rules = {
      name: [{ required: true, message: "Name cannot be empty", trigger: "blur" }],
      image_id: [{ required: true, message: "Icon cannot be empty", trigger: "blur" }],
    };
    const formRef = ref(null);
    const form = reactive({
      name: "",
      active: true,
      arrange: 0,
      image_id: "",
    });

    // 提交
    const onSubmit = () => {
      // 表单校验
      formRef.value.validate(async (valid) => {
        if (valid) {
          console.log(form);
          let res = await api.addCategory(form);
          if (res.status == 201) {
            ElMessage.success("Category Added");
            router.back()
          } else {
            ElMessage.error("Failed, Please contact IT department");
          }
        } else {
          return false;
        }
      });
    };
    // 重置
    const onReset = () => {
      formRef.value.resetFields();
    };

    const onImageUploadSuccess = (response, file, fileList) => {
      console.log(response);
      form.image_id = response.id;
    };

    const onImageUploadError = (err, file, fileList) => {
      console.log(err);
    };

    return {
      router,
      rules,
      formRef,
      form,
      onSubmit,
      onReset,
      onImageUploadSuccess,
      onImageUploadError,
    };
  },
};
</script>
