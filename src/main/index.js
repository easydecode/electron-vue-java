import { app, BrowserWindow, Menu, Tray } from 'electron'
const path = require('path')
const child_process = require('child_process')

const start_java = child_process.fork(path.join(__dirname, 'start-java.js'))
const stop_java = child_process.fork(path.join(__dirname, 'stop-java.js'))

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

let tray = null
function createWindow() {
  start_java.send('start')
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    transparent: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', (event) => {
    mainWindow.hide()
    mainWindow.setSkipTaskbar(true)
    event.preventDefault()
  })

  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  })
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  })

  tray = new Tray('build/icons/256x256.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出', click: () => {
        mainWindow.hide()
        stop_java.send('stop')
        // mainWindow.destroy()
      }
    } // 我们需要在这里有一个真正的退出（这里直接强制退出）
  ])
  tray.setToolTip('中世发打印系统')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => { // 我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true)
  })
}

stop_java.on('message', (msg) => {
  if (msg === 'success') {
    console.log('stop success')
    mainWindow.destroy()
  }
})

app.on('ready', () => {
  createWindow()
})

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
