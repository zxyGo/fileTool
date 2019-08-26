<template>
  <div>
    <Modal
      v-model="isShow"
      :mask-closable="false"
      :loading="loading"
      :ok-text="'更新'"
      @on-ok="ok"
      @on-cancel="cancel"
      >
      <p slot="header" style="color: #f60;">
        <Icon type="ios-alert" />
        提示
      </p>
      <div class="modal-content">发现有新版本【v{{version}}】，是否更新?</div>
      <div class="update">
        <p class="update-title">更新内容</p>
        <p v-html="updateContent"></p>
      </div>
      <Progress :percent="percent" class="update-progress" status="active" v-if="download"/>
    </Modal>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')
export default {
  data() {
    return {
      isShow: false,
      loading: true,
      version: '',
      download: false,
      percent: 0,
      updateContent:''
    }
  },
  created() {
        // 发现新版本
        const self = this
        ipcRenderer.once('autoUpdater-canUpdate', (event, info) => {
          console.log(info)
          this.$http({
            url: 'https://document-1-1255829223.cos.ap-shanghai.myqcloud.com/electron/update.json',
            method: 'get'
          }).then(res=> {
            console.log(res)
            this.updateContent = res.data.update_content
          })
          this.isShow = true;
          this.version = info.version
          
        })
        // 下载进度
        ipcRenderer.on('autoUpdater-progress', (event, process) => {
          if (process.transferred >= 1024 * 1024) {
            process.transferred = (process.transferred / 1024 / 1024).toFixed(2) + 'M'
          } else {
            process.transferred = (process.transferred / 1024).toFixed(2) + 'K'
          }
          if (process.total >= 1024 * 1024) {
            process.total = (process.total / 1024 / 1024).toFixed(2) + 'M'
          } else {
            process.total = (process.total / 1024).toFixed(2) + 'K'
          }
          if (process.bytesPerSecond >= 1024 * 1024) {
            process.speed = (process.bytesPerSecond / 1024 / 1024).toFixed(2) + 'M/s'
          } else if (process.bytesPerSecond >= 1024) {
            process.speed = (process.bytesPerSecond / 1024).toFixed(2) + 'K/s'
          } else {
            process.speed = process.bytesPerSecond + 'B/s'
          }
          process.percent = process.percent.toFixed(2)
          this.percent = Number(process.percent)
          console.log(process)
          if (process.percent == '100') {
            this.isShow = false
          }
          // this.showUpdater = true
        })
        // 下载更新失败
        ipcRenderer.once('autoUpdater-error', (event) => {
          console.log('test', event)
          this.$Message.error('更新失败！')
          this.showUpdater = false
        })
        // 下载完成
        ipcRenderer.once('autoUpdater-downloaded', () => {
          this.$Modal.info({
            title: '提示',
            content: `更新完成，是否关闭应用程序安装新版本?`,
            okText: '安装',
            onOk: () => {
              ipcRenderer.send('exit-app')
            },
          })
          // this.$confirm(`更新完成，是否关闭应用程序安装新版本?`, '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   ipcRenderer.send('exit-app')
          // })
        })
  },
  methods: {
    ok() {
      ipcRenderer.send('autoUpdater-toDownload')
      this.download = true
    },
    cancel() {
      this.isShow = false
    }
  }
}
</script>
<style lang="less" scoped>
  .modal-content {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .update {
    padding: 0 10px;

    &-title {
      font-size: 14px;
      font-weight: 700;
    }
  }
  .update-progress {
    margin-top: 10px;
  }
</style>