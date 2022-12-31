<template>
  <div class="photoalbum-wrap">
    <div class="btn-wrap">
      <el-button
        style="margin-left: 10px"
        type="success"
        class="submit-btn"
        @click="onAdd()"
      >
        新建相册
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="photoalbumloading"
      border
    >
      <!-- <el-table-column prop="id" label="ID" align="center" width="80"> -->
      <!-- </el-table-column> -->
      <el-table-column prop="name" label="相册名" align="center">
      </el-table-column>
      <el-table-column prop="path" label="文件夹路径" align="center">
      </el-table-column>
      <el-table-column
        prop="qrcodeImg"
        min-width="76"
        label="相册二维码"
        align="center"
      >
        <template slot-scope="scope">
          <div id="qrcodeArea">
            <!-- <QrCodeImg
              :id="scope.row.id"
              :qrContent="scope.row.qrcodeImg"
              :qrHeight="qrHeight"
              :qrWidth="qrWidth"
            /> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="照片数" width="80" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          {{ timeChange(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'off' ? '' : 'success'">
            {{ scope.row.status === "off" ? "下线" : "上线" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            :type="row.status === 'off' ? 'success' : 'primary'"
            @click="changeStatus(row)"
          >
            {{ row.status === "off" ? "上线" : "下线" }}</el-button
          >
          <el-button size="mini" @click="goDetail(row)">详情</el-button>
          <!-- <el-button
            :disabled="row.status === 'off'? false : true"
            type="primary"
            size="mini"
            @click="onEdit(row)">编辑</el-button> -->
          <el-button
            :disabled="row.status === 'off' ? false : true"
            size="mini"
            type="danger"
            @click="onDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog title="修改相册状态" :visible.sync="statusVisible">
      <p class="status-warning">确定要修改此相册状态吗?</p>
      <p class="status-warning">修改相册状态将影响照片的实时显示</p>
      <p class="status-warning">
        相册状态为上线时会实时显示照片，但是无法编辑、删除相册
      </p>
      <p class="status-warning">
        相册状态为下线时不会实时显示照片，但是可以编辑、删除相册
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onStatusCancle()">取 消</el-button>
        <el-button type="primary" @click="onStatusConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="type === 'edit' ? '修改相册' : '新增相册'"
      :visible.sync="formVisible"
    >
      <el-form :model="form" ref="form">
        <el-form-item
          label="相册名"
          :label-width="formLabelWidth"
          :rules="{
            required: true,
            message: '相册名不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onFormCancle()">取 消</el-button>
        <el-button type="primary" @click="onFormConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除相册" :visible.sync="deleteVisible">
      <p class="delete-warning">确定要删除此相册吗?</p>
      <p class="delete-warning">此行为将会删除此相册及相册下面的所有照片!</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDeleteCancle()">取 消</el-button>
        <el-button type="primary" @click="onDeleteConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QrCodeImg from "@/components/QrCodeImg";
export default {
  name: "Photoalbum",
  components: {
    QrCodeImg,
  },
  data() {
    return {
      tableData: [],
      formVisible: false,
      deleteVisible: false,
      statusVisible: false,
      form: {
        name: "",
      },
      formLabelWidth: "100px",
      type: "",
      qrWidth: 180,
      qrHeight: 120,
      photoalbumloading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      row: null,
    };
  },
  mounted() {
    this.initList();
  },
  methods: {
    initList(page = 1, pageSize = 10) {
      this.photoalbumloading = true;
      this.$store
        .dispatch("photoalbum/list", {
          page,
          pageSize,
        })
        .then((response) => {
          if (response && response.code === 0) {
            this.$message({
              message: "查询相册成功",
              type: "success",
            });
            const { data, page, pageSize, total } = response;
            this.tableData = data;
            this.page = page;
            this.pageSize = pageSize;
            this.total = total;
          } else {
            this.$message({
              message: "查询相册失败",
              type: "error",
            });
          }
          this.photoalbumloading = false;
        })
        .catch(() => {
          this.photoalbumloading = false;
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.initList(this.page, val);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.initList(val, this.pageSize);
    },
    reset() {
      this.form = {
        name: "",
      };
      this.type = "";
      this.row = null;
    },
    onAdd() {
      this.formVisible = true;
      this.type = "add";
    },
    // onEdit(row) {
    //   this.formVisible = true;
    //   this.type = "edit";
    //   this.row = row
    //   this.form.name = row.name
    // },
    changeStatus(row) {
      this.statusVisible = true;
      this.row = row;
    },
    onFormCancle() {
      this.formVisible = false;
      this.reset();
    },
    onFormConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.photoalbumloading = true;

          if (this.type === "add") {
            this.$store
              .dispatch("photoalbum/add", this.form)
              .then((response) => {
                if (response && response.code === 0) {
                  this.$message({
                    message: "新增相册成功",
                    type: "success",
                  });

                  this.formVisible = false;
                  this.photoalbumloading = false;
                  this.initList();
                  this.reset();
                } else {
                  this.$message({
                    message: "新增相册失败",
                    type: "error",
                  });
                }
              })
              .catch((err) => {
                this.photoalbumloading = false;
              });
          } else if (this.type === "edit") {
            const params = {
              ...this.row,
              name: this.form.name,
            };
            this.$store
              .dispatch("photoalbum/edit", params)
              .then((response) => {
                if (response && response.code === 0) {
                  this.$message({
                    message: "编辑相册成功",
                    type: "success",
                  });

                  this.formVisible = false;
                  this.photoalbumloading = false;
                  this.initList();
                  this.reset();
                } else {
                  this.$message({
                    message: "编辑相册失败",
                    type: "error",
                  });
                }
              })
              .catch((err) => {
                this.photoalbumloading = false;
              });
          }
        }
      });
    },
    onDelete(row) {
      this.deleteVisible = true;
      this.row = row;
    },
    onDeleteCancle() {
      this.deleteVisible = false;
      this.row = null;
    },
    onDeleteConfirm() {
      this.photoalbumloading = true;
      this.$store
        .dispatch("photoalbum/delete", {
          id: this.row.id,
          path: this.row.path,
        })
        .then((response) => {
          if (response && response.code === 0) {
            this.$message({
              message: "删除相册成功",
              type: "success",
            });
            this.deleteVisible = false;
            this.photoalbumloading = false;
            this.initList();
          } else {
            this.$message({
              message: "删除相册失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.photoalbumloading = false;
        });
      this.row = null;
    },
    onStatusCancle() {
      this.statusVisible = false;
      this.reset();
    },
    onStatusConfirm() {
      this.statusVisible = true;
      this.$store
        .dispatch("photoalbum/changeStatus", this.row)
        .then((response) => {
          if (response && response.code === 0) {
            this.$message({
              message: "修改相册状态成功",
              type: "success",
            });
            this.statusVisible = false;
            this.photoalbumloading = false;
            this.initList();
          } else {
            this.$message({
              message: "修改相册状态失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.photoalbumloading = false;
        });
      this.row = null;
    },
    goDetail(row) {
      this.$router.push({
        name: "photolist",
        params: {
          id: row.id,
        },
      });
    },
    timeChange(data) {
      let time = data; //将需要格式化的数据传入
      time = this.dayjs(time).format("YYYY-MM-DD HH:mm:ss");
      return time;
    },
  },
};
</script>

<style lang="scss">
.photoalbum-wrap {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .pagination-wrap {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .btn-wrap {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
    background-color: rgb(255, 255, 255);
  }
  .delete-warning {
    color: red;
    font-size: 16px;
  }
  .status-warning {
    font-size: 16px;
  }
}
</style>
