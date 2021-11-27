<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> All Products </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.category_id" placeholder="Category" class="handle-select mr10" @change="loadData">
          <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
        </el-select>
        <!-- <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
      </div>
      <el-table :data="tableData.content" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="Nmae"></el-table-column>
        <el-table-column label="Price">
          <template #default="scope">￥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="Image (Click To Preview)" align="center">
          <template #default="scope">
            <el-image class="table-td-thumb" :src="imageUrl + scope.row.images[0].file_path" :preview-src-list="processImages(scope.row.images)"> </el-image>
          </template>
        </el-table-column>
        <el-table-column label="Published">
          <template #default="scope">
            <el-switch v-model="scope.row.published" disabled></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="created" label="Created"></el-table-column>
        <el-table-column label="Operations" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.page + 1"
          :page-size="tableData.size"
          :total="tableData.totalElements"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";
import { api } from "../api/index";
import { constants } from "../utils/constants";
import { useRouter } from "vue-router";

export default {
  name: "Products",
  setup() {
    const router = useRouter();
    const query = reactive({
      page: 0,
      category_id: -1,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    const imageUrl = constants.resourceBaseUrl;
    const categories = ref([{ id: -1, name: "All" }]);

    // 获取表格数据
    const getData = async () => {
      let res = await api.getProducts(query);
      console.log(res);
      tableData.value = res.data;

      let cateRes = await api.getAllCategories();
      console.log(cateRes);
      categories.value = categories.value.concat(cateRes.data);
    };
    const loadData = async () => {
      let res = await api.getProducts(query);
      console.log(res);
      tableData.value = res.data;
    };
    getData();

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.page = val == 0 ? val : val - 1;
      loadData();
    };

    // 删除操作
    const handleDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm("Are you sure to delete? You can hide the product by setting published to off. This delete action is PERMENENT.", "Reminder", {
        type: "warning",
      })
        .then(async() => {
          let res = await api.deleteProduct({id:row.id})
          if(res.status !=200){
            return ElMessage.error("Deletion failed")
          }
          ElMessage.success("Successful Deleted");
          loadData()
        })
        .catch(() => {});
    };

    const processImages = (images) => {
      let result = [];
      images.forEach((image) => {
        result.push(imageUrl + image.file_path);
      });
      return result;
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      name: "",
      address: "",
    });
    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      router.push("/editProduct/" + row.id);
    };
    const saveEdit = () => {
      editVisible.value = false;
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      Object.keys(form).forEach((item) => {
        tableData.value[idx][item] = form[item];
      });
    };

    return {
      imageUrl,
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      categories,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      processImages,
      loadData,
    };
  },
  data() {
    return {};
  },
  created() {},
  methods() {},
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
