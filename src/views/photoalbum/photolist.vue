<template>
  <div class="photoalbum-wrap">
    <div class="btn-wrap">
      <el-button
        style="margin-left: 10px"
        type="success"
        class="submit-btn"
        @click="onUpload()"
      >
        上传图片
      </el-button>
      <!-- <el-button style="margin-left: 10px" type="danger" class="submit-btn">
        批量删除
      </el-button> -->
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="photoloading"
      border
    >
      <el-table-column prop="filename" label="照片名" align="center">
      </el-table-column>
      <el-table-column label="缩略图" width="230" align="center">
        <template slot-scope="scope">
          <a :href="`${host}\\${scope.row.url}`" target="_blank">
            <img
              :src="`${host}\\${scope.row.url}`"
              style="width: 180px; height: 120px"
            />
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="照片二维码" width="230" align="center">
        <template slot-scope="scope">
          <div id="qrcodeArea" v-if="scope.row.url">
            <QrCodeImg
              :id="scope.row.id"
              :qrContent="scope.row.url"
              :qrHeight="qrHeight"
              :qrWidth="qrWidth"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="danger" @click="onDelete(row)"
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

    <el-dialog
      title="上传照片"
      :visible.sync="uploadVisible"
      :close-on-click-modal="false"
    >
      <el-upload
        class="upload"
        drag
        ref="upload"
        :on-change="onChange"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        action=""
        :http-request="uploadFile"
        multiple
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过20MB
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onUploadCancle()">取 消</el-button>
        <el-button
          type="primary"
          :disabled="fileList && fileList.length > 0 ? false : true"
          @click="onUploadConfirm()"
          >上传到服务器</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="删除照片" :visible.sync="deleteVisible">
      <p class="delete-warning">确定要删除此照片吗?</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDeleteCancle()">取 消</el-button>
        <el-button type="primary" @click="onDeleteConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QrCodeImg from "@/components/QrCodeImg";
import io from "socket.io-client";
import { wsUrl } from "@/constants";
export default {
  name: "Photolist",
  components: { QrCodeImg },
  data() {
    return {
      host: process.env.VUE_APP_BASE_API,
      tableData: [],
      fileList: [],
      imgsArr: [],
      qrWidth: 180,
      qrHeight: 120,
      photoalbumId: null,
      uploadVisible: false,
      deleteVisible: false,
      photoloading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      row: null,
      socket: null,
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.photoalbumId = id;
  },
  mounted() {
    this.initList();
    this.socket = io(wsUrl);
  },
  destroyed() {
    this.socket.disconnect();
    this.socket.on("disconnect", function () {
      console.log("客户端接收服务器发送的消息disconnect");
    });
  },
  methods: {
    initList(page = 1, pageSize = 10) {
      this.photoloading = true;
      this.$store
        .dispatch("photo/list", {
          photoalbumId: this.photoalbumId,
          page,
          pageSize,
        })
        .then((response) => {
          if (response && response.code === 0) {
            this.$message({
              message: "查询照片成功",
              type: "success",
            });
            const { data, page, pageSize, total } = response;

            this.tableData = data;
            this.page = page;
            this.pageSize = pageSize;
            this.total = total;
            this.socket.emit("reloadPhotoBackend", 1);
          } else {
            this.$message({
              message: "查询照片失败",
              type: "error",
            });
          }
          this.photoloading = false;
        })
        .catch(() => {
          this.photoloading = false;
        });
    },
    onUpload() {
      this.uploadVisible = true;
    },
    handleRemove(file, fileList) {
      this.$message.success("删除成功");
      this.fileList = this.fileList.filter((item) => {
        return item.name !== file.name && item.size !== file.size;
      });
    },
    handlePreview(file) {
      console.log(file);
    },
    onUploadCancle() {
      this.uploadVisible = false;
      this.fileList = [];
      this.imgsArr = [];
    },
    onChange(file, fileList) {
      if (file.status === "ready") {
        const myFile = file.raw;
        const type = myFile.type.toLowerCase();
        const isJPGPNG = type === "image/jpeg" || type === "image/png";
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isJPGPNG) {
          this.$message.error("上传头像图片只能是JPG和PNG格式!");
        }
        if (!isLt20M) {
          this.$message.error("上传图片大小不能超过20MB!");
        }
        if (!isJPGPNG || !isLt20M) {
          fileList.pop();
          return;
        }

        // 存在文件标识
        let existsFileFlag = false;
        for (let i = 0; i < this.fileList.length; i++) {
          if (
            file.name === this.fileList[i].name &&
            file.size === this.fileList[i].size
          ) {
            // 如果存在了，赋值true
            existsFileFlag = true;
          }
        }
        if (existsFileFlag) {
          fileList.pop();
          this.$message.error("文件重复！");
          return;
        }
        this.fileList.push(file);
      }
    },
    uploadFile(file) {
      this.imgsArr.push(file.file);
    },
    onUploadConfirm() {
      // this.uploadVisible = false;
      this.$refs.upload.submit();
      const formData = new FormData();
      this.imgsArr.forEach((img, index) => {
        formData.append(`img${index++}`, img);
      });
      formData.append("photoalbumId", this.photoalbumId);
      this.$store
        .dispatch("upload/picture", formData)
        .then((response) => {
          if (response && response.code === 0) {
            this.$message({
              message: "上传成功",
              type: "success",
            });
            this.imgsArr = [];
            this.fileList = [];
            this.uploadVisible = false;
            this.initList();
          } else {
            this.$message({
              message: "上传失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
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
      this.photoloading = true;
      this.$store
        .dispatch("photo/delete", this.row)
        .then((response) => {
          if (response && response.code === 0) {
            this.$message({
              message: "删除照片成功",
              type: "success",
            });
            this.deleteVisible = false;
            this.photoloading = false;
            this.initList();
          } else {
            this.$message({
              message: "删除照片失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.photoloading = false;
        });
      this.row = null;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.initList(this.page, val);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.initList(val, this.pageSize);
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
  .upload {
    width: 100%;
    .el-upload {
      width: 100%;
      .el-upload-dragger {
        width: 100%;
      }
    }
  }
}
</style>
