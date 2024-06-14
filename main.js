const { app, BrowserWindow, Menu } = require('electron/main')
const { Client } = require('discord-rpc')
const ytData = require('./scripts/yt-data')
const {
  winSettings,
  winModalSetting,
} = require('./scripts/utils/windowSettings')
const logTimeStamp = require('./scripts/utils/timestamp')

const rpc = new Client({ transport: 'ipc' })
const clientId = '623558135994384437'

let win, winModal

const connectorRPC = (attempt = 0) => {
  if (attempt >= 5) {
    logTimeStamp('Failed to connect to Discord RPC after multiple attempts')
    win?.webContents.executeJavaScript(connectionStatus)
    return
  }
  attempt += 1
  rpc
    .login({ clientId })
    .catch(() => setTimeout(() => connectorRPC(attempt), 10e4))
}

const checkYtData = async () => {
  if (!rpc || !win) return
  try {
    const data = await ytData(win)
    // console.log(data);
    rpc.setActivity(data)
  } catch (error) {
    console.error('Error retrieving YouTube data:', error)
  }
}

const createWindow = () => {
  win = new BrowserWindow(winSettings)
  winModal = new BrowserWindow(winModalSetting)
  winModal.hide()

  win.webContents.openDevTools()

  win.webContents.on('will-navigate', (e, url) => {
    const uri = new URL(url).host
    if (uri === 'accounts.google.com') {
      e.preventDefault()
      winModal.show()
      winModal.loadURL(url)
    }
  })

  win.on('closed', () => {
    logTimeStamp('Exiting the Electron window')
    app.quit()
  })

  winModal.on('closed', () => {
    app.quit()
  })

  win.openDevTools()
  Menu.setApplicationMenu(null)
  win.loadURL('https://www.youtube.com')
  connectorRPC()
}

rpc.on('ready', () => {
  logTimeStamp('Connected to Discord RPC')
  checkYtData()
  setInterval(checkYtData, 5e3)
})

app.on('ready', () => {
  logTimeStamp('Creating Electron window')
  createWindow()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) {
      logTimeStamp('Secondary window opened for sign-up')
      win.restore()
      return
    }
    win.focus()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) {
  logTimeStamp('Another instance of the application is already running')
  app.quit()
} else {
  logTimeStamp('Single instance lock acquired')
}
