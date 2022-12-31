<template>
  <div>
    <img v-if="imgData != ''" :src="imgData" />
    <div :id="`${id}`" class="qrcode" v-show="imgData === ''"></div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2"; // 引入qrcode
export default {
  name: "QrCodeImg",
  props: ["id", "qrContent", "qrWidth", "qrHeight"],
  data() {
    return {
      imgData: "",
    };
  },
  watch: {
    qrContent: function (val) {
      this.qrcode();
    },
  },
  created() {},
  mounted() {
    const that = this;
    setTimeout(() => {
      that.$nextTick(() => {
        that.qrcode();
      });
    }, 300);
  },
  methods: {
    qrcode() {
      this.$nextTick(() => {
        document.getElementById(`${this.id}`).innerHTML = "";
        const href = this.qrContent.replace(".", process.env.VUE_APP_BASE_HOST);
        new QRCode(`${this.id}`, {
          text: href,
          // text: "http://www.baidu.com",
          width: this.qrWidth,
          height: this.qrHeight,
          colorDark: "#333333",
          colorLight: "#F8F8FF",
          correctLevel: QRCode.CorrectLevel.L,
        });
        const canvasobj = document.getElementsByTagName("canvas")[0];
        // 将转换后的img标签插入到html中
        const img = this.CanvasToImage(canvasobj);
        this.imgData = img.src;
      });
    },
    CanvasToImage(canvas) {
      var image = new Image();
      return image;
    },
    downloadSingleUrl(params) {
      const canvasData =
        this.$refs["qrcodeImg" + params.id].getElementsByTagName("canvas");
      const a = document.createElement("a");
      const event = new MouseEvent("click");
      a.href = canvasData[0].toDataURL("image/png");
      a.download = params.name;
      a.dispatchEvent(event);
    },
  },
};
</script>
<style lang="scss">
div img {
  cursor: pointer;
  transition: all 0.6s;
}

// div img:hover {
//   transform: scale(1.2);
// }
</style>
