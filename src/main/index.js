import { app, BrowserWindow, Menu, MenuItem, globalShortcut, ipcMain } from 'electron'
// 发现新版本更新
import {autoUpdater} from 'electron-updater'
import path from 'path'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  // 解决mac复制问题
  if (process.platform === 'darwin') {
    const template = [
      {
        label: "Application",
        submenu: [
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]
      }, 
      {
        label: "Edit",
        submenu: [
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        ]
      }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    Menu.setApplicationMenu(null)
  }
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })
  
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // updateHandle()
}

// 处理更新操作
function sendStatusToWindow(status, params) {
  mainWindow.webContents.send(status, params)
}
if (process.env.NODE_ENV === 'development') {
  autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml');
}

autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://document-1-1255829223.cos.ap-shanghai.myqcloud.com/electron/'
});
autoUpdater.autoDownload = false // 是否自动更新
autoUpdater.autoInstallOnAppQuit = true // App退出的时候自动安装
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  // 可以更新版本
  sendStatusToWindow('autoUpdater-canUpdate', info)
})
autoUpdater.on('error', (err) => {
  // 更新错误
  sendStatusToWindow('autoUpdater-error', err)
})
autoUpdater.on('download-progress', (progressObj) => {
  // 正在下载的下载进度
  sendStatusToWindow('autoUpdater-progress', progressObj)
})
autoUpdater.on('update-downloaded', (info) => {
  // 下载完成
  sendStatusToWindow('autoUpdater-downloaded')
})
// 监听渲染线程中用户是否同意下载
ipcMain.on('autoUpdater-toDownload',() =>{
  
  autoUpdater.downloadUpdate();
})
// 监听用户退出更新
ipcMain.on('exit-app', () => {
  autoUpdater.quitAndInstall();
})


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
app.on('ready', () => {
  if (mainWindow == null) {
    createWindow()
  }
  // 打开控制台
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    let focusWin = BrowserWindow.getFocusedWindow()
    focusWin && focusWin.toggleDevTools()
  })
  // // 每次运行APP检测更新。这里设置延时是为了避免还未开始渲染，更新检测就已经完成(网速超快，页面加载跟不上)。
  setTimeout(() => {
    // 检测是否有更新
    autoUpdater.checkForUpdates()
  }, 1500)
})

