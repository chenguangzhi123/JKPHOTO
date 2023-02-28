<template>
  <div class="wrap">
    <!-- <div class="cover"></div> -->
    <div class="row">
      <div v-for="(item, index) in tableData" :key="index" class="col">
        <el-card class="card">
          <el-image
            :src="`${host}\\${item.url}`"
            :preview-src-list="[`${host}\\${item.url}`]"
            class="image"
          >
          </el-image>
          <div class="qrcode">
            <QrCodeImg
              :id="item.id"
              :qrContent="item.url"
              :qrHeight="qrHeight"
              :qrWidth="qrWidth"
            />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import QrCodeImg from "@/components/QrCodeImg";
import io from "socket.io-client";
import { settingSocket } from "@/utils";
export default {
  name: "PublicPhotoList",
  components: { QrCodeImg },
  data() {
    return {
      host: process.env.VUE_APP_BASE_API,
      photoalbumId: null,
      tableData: [],
      srcList: [],
      page: 1,
      pageSize: 100,
      total: 0,
      qrWidth: 200,
      qrHeight: 150,
      socket: null,
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.photoalbumId = id;
  },
  mounted() {
    this.initList();
    this.socket = io("ws://localhost:4000");
    settingSocket(this.socket);
  },
  destroyed() {
    this.socket.disconnect();
    this.socket.on("disconnect", function () {
      console.log("客户端接收服务器发送的消息disconnect");
    });
  },
  methods: {
    initList(page = 1, pageSize = 100) {
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
  },
};
</script>

<style lang="scss">
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-image: url("../../assets/publicPhotoList/damen.jpg");
  background-size: 100% 100%;
  background-attachment: fixed;
}
// .cover {
//   // z-index: 1;
//   position: absolute;
//   left: 0;
//   top: 0;
//   background-color: rgba(0, 0, 0, 0.2);
//   width: 100%;
//   height: 100%;
// }
.row {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.col {
  width: 22%;
  margin: 20px;
  display: flex;
  // z-index: 1;
}
.card {
  width: 100%;
}
.image {
  width: 100%;
  height: 200px;
}
.qrcode {
  width: 200px;
  height: 150px;
  margin: 20px auto;
}
.el-image-viewer__close {
  color: #fff;
}

.el-image-viewer__canvas img {
  z-index: 4;
}
.el-image-viewer__mask {
  z-index: 3;
}
.el-image-viewer__close {
  z-index: 5;
}
.el-image-viewer__actions {
  z-index: 6;
}
</style>
