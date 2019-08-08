<template>
  <div id="app">
    <router-view></router-view>
    <update-modal></update-modal>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
import UpdateModal from './component/updateModal'
  export default {
    name: 'file_tool',
    data() {
      return {
        showUpdater: false,
        downloadProcess: null
      }
    },
    created() {
      // this.downloadPro()
      // this.$Modal.info({
      //       title: '提示',
      //       render(h) {
      //         return h('div', {
      //           style: {
      //             fontSize: '16px'
      //           }
      //         },[
      //           h('div', '发现有新版本【v${info.version}】，是否更新?'),
      //           h('Progress', {
      //             props: {
      //               status: 'active',
      //               percent: 45
      //             },
      //             style: {
      //               display: this.showUpdater ? 'block' : 'none'
      //             }
      //           })
      //         ])
      //       },
      //       loading: true,
      //       onOk: () => {
      //         this.showUpdater = true
      //         // ipcRenderer.send('autoUpdater-toDownload')
      //       }
      //     })
      // // 仅在Electron模式下(为了让非Electron后能够正常运行，添加的判断)
      // // if (process.env.IS_ELECTRON) {
      //   const { ipcRenderer } = require('electron')
      //   // 发现新版本
      //   const self = this
      //   ipcRenderer.once('autoUpdater-canUpdate', (event, info) => {
      //     console.log(info)
      //     this.$Modal.info({
      //       title: '提示',
      //       render(h) {
      //         return h('div', {
      //           style: {
      //             fontSize: '16px'
      //           }
      //         },[
      //           h('div', `发现有新版本【v${info.version}】，是否更新?`),
      //           h('Progress', {
      //             props: {
      //               status: 'active',
      //               percent: 45
      //             }
      //           })
      //         ])
      //       },
      //       loading: true,
      //       onOk: () => {
      //         // ipcRenderer.send('autoUpdater-toDownload')
      //         console.log(self)
      //         // setTimeout(() => {
      //         //   console.log(self)
      //           // self.downloadPro()
      //         // }, 1000)
              
      //       }
      //     })
      //   })
      //   // 下载进度
      //   ipcRenderer.on('autoUpdater-progress', (event, process) => {
      //     if (process.transferred >= 1024 * 1024) {
      //       process.transferred = (process.transferred / 1024 / 1024).toFixed(2) + 'M'
      //     } else {
      //       process.transferred = (process.transferred / 1024).toFixed(2) + 'K'
      //     }
      //     if (process.total >= 1024 * 1024) {
      //       process.total = (process.total / 1024 / 1024).toFixed(2) + 'M'
      //     } else {
      //       process.total = (process.total / 1024).toFixed(2) + 'K'
      //     }
      //     if (process.bytesPerSecond >= 1024 * 1024) {
      //       process.speed = (process.bytesPerSecond / 1024 / 1024).toFixed(2) + 'M/s'
      //     } else if (process.bytesPerSecond >= 1024) {
      //       process.speed = (process.bytesPerSecond / 1024).toFixed(2) + 'K/s'
      //     } else {
      //       process.speed = process.bytesPerSecond + 'B/s'
      //     }
      //     process.percent = process.percent.toFixed(2)
      //     this.downloadProcess = process
      //     console.log(process)
      //     this.showUpdater = true
      //   })
      //   // 下载更新失败
      //   ipcRenderer.once('autoUpdater-error', (event) => {
      //     console.log('test', event)
      //     this.$Message.error('更新失败！')
      //     this.showUpdater = false
      //   })
      //   // 下载完成
      //   ipcRenderer.once('autoUpdater-downloaded', () => {
      //     this.$Modal.info({
      //       title: '提示',
      //       content: `更新完成，是否关闭应用程序安装新版本?`,
      //       onOk: () => {
      //         ipcRenderer.send('exit-app')
      //       }
      //     })
      //     // this.$confirm(`更新完成，是否关闭应用程序安装新版本?`, '提示', {
      //     //   confirmButtonText: '确定',
      //     //   cancelButtonText: '取消',
      //     //   type: 'warning'
      //     // }).then(() => {
      //     //   ipcRenderer.send('exit-app')
      //     // })
      //   })
      // }
    },
    components: {
      UpdateModal
    }
  }
</script>

<style>
  /* CSS */
</style>
