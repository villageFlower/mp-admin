<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> Porduct Categories </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">Add Category</el-button>
      </div>
      <el-table :data="tableData.content" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="arrange" label="Rank"></el-table-column>

        <el-table-column prop="name" label="Name"></el-table-column>

        <el-table-column label="Published">
          <template #default="scope">
            <el-switch v-model="scope.row.active" disabled></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="Icon (Click To Preview)" align="center">
          <template #default="scope">
            <el-image class="table-td-thumb" :src="imageUrl + scope.row.icon.file_path" :preview-src-list="[imageUrl + scope.row.icon.file_path]"> </el-image>
          </template>
        </el-table-column>

        <el-table-column label="Operations" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">Edit </el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.page+1" :page-size="tableData.size" :total="tableData.totalElements" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="Edit" v-model="editVisible" width="30%">
      <el-form label-width="80px">
        <el-form-item label="Rank">
          <el-input-number size="mini" v-model="form.arrange" :min="0" label="Catgory displaying priority"></el-input-number>
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Published" prop="active">
          <el-switch v-model="form.active"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveEdit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";
import { useRouter } from "vue-router";
import { api } from "../api/index";
import { constants } from "../utils/constants";

export default {
  name: "basetable",
  setup() {
    const router = useRouter();
    const imageUrl = constants.resourceBaseUrl;
    const query = reactive({
      page:0,
    });
    const tableData = ref([]);
    // 获取表格数据
    const getData = async () => {
      let res = await api.getCategories(query);
      tableData.value = res.data;
      console.log(res);
    };
    getData();
    // 分页导航
    const handlePageChange = (val) => {
      query.page = val-1;
      getData();
    };

    const handleAdd = () => {
      router.push("/addCategory");
    };

    // 删除操作
    const handleDelete = (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("Are you sure to delete？", "Reminder", {
        type: "warning",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      })
        .then(async () => {
          idx = index;
          console.log(row);
          form.id = row.id;
          form.arrange = row.arrange;
          form.active = row.active;
          form.name = row.name;
          let res = await api.deleteCategory(form);
          if (res.status != 200) {
            ElMessage.error("Server Error, Please Contact IT Department");
            return;
          }
          tableData.value[idx] = res.data;
          ElMessage.success("Category Deleted");
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      active: true,
      arrange: 0,
      id: 1,
      name: "Facial Mask",
    });
    let idx = -1;

    const handleEdit = (index, row) => {
      idx = index;
      console.log(row);
      form.id = row.id;
      form.arrange = row.arrange;
      form.active = row.active;
      form.name = row.name;

      editVisible.value = true;
    };

    const saveEdit = async () => {
      let res = await api.updateCategory(form);
      if (res.status != 200) {
        ElMessage.error("Server Error, Please Contact IT Department");
        return;
      }
      tableData.value[idx] = res.data;
      editVisible.value = false;
      ElMessage.success(`Update Successful`);
    };

    return {
      imageUrl,
      router,
      query,
      tableData,
      editVisible,
      form,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      handleAdd,
    };
  },
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
