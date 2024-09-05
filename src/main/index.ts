import 'dotenv/config';
import { app, BrowserWindow, globalShortcut } from 'electron'
import './dialog'
import { Logger } from './logger'
import { initialize } from './services'
import createBaseWorker from './workers/index?worker'
import indexPreload from '/@preload/index'
// import anotherPreload from '/@preload/another'
import indexHtmlUrl from '/@renderer/index.html'
// import sideHtmlUrl from '/@renderer/side.html'
import logoUrl from '/@static/logo.png'

async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  initialize(logger)
  app.whenReady().then(() => {
    const main = createWindow()

    // const [x, y] = main.getPosition()
    // const side = createSecondWindow()
    // side.setPosition(x + 800 + 5, y)
    main.maximize();
    main.show();
    main.on('focus', () => {
      globalShortcut.register('CommandOrControl+F', function () {
        if (main && main.webContents) {
          main.webContents.send('on-find', '')
        }
      })
    })
    main.on('blur', () => {
      globalShortcut.unregister('CommandOrControl+F')
    })
  })
  // thread_worker example
  createBaseWorker({ workerData: 'worker world' }).on('message', (message) => {
    logger.log(`Message from worker: ${message}`)
  }).postMessage('')
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: indexPreload,
      contextIsolation: false,
      nodeIntegration: true,
      devTools: true,
      webSecurity: false,
      enableRemoteModule: true
    },
    icon: logoUrl,
    show: false
  })

  mainWindow.loadURL(indexHtmlUrl)
  return mainWindow
}

// function createSecondWindow() {
//   const sideWindow = new BrowserWindow({
//     height: 600,
//     width: 300,
//     webPreferences: {
//       // preload: anotherPreload,
//       contextIsolation: true,
//       nodeIntegration: false
//     }
//   })

//   sideWindow.loadURL('http://zha-csci07-w10:38080/?offline=1&https=0')
//   return sideWindow
// }

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  globalShortcut.unregister('CommandOrControl+F')
})

process.nextTick(main)
