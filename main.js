const { app, BrowserWindow, Menu } = require('electron/main');
const { Client } = require('discord-rpc');

const rpc = new Client({ transport: 'ipc' });

// const pageLoad = __dirname + 'index.html';

let winMain,
  winSettings = {
    width: 800,
    height: 600,
    useContentSize: false,
    backgroundColor: '#2e2c29',
    title: 'Youtube RPC',
    icon: __dirname + '/assets/yt.png',
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
    },
  };
const clientId = '623558135994384437';

const connectorRPC = (attempt = 0) => {
  if (attempt > 15) {
    return winMain.webContents.executeJavaScript(connectorAlert);
  }
  attempt += 1;
  console.log(attempt);
  rpc
    .login({ clientId })
    .catch((e) => setTimeout(() => connectorRPC(tries), 1000));
};

// creating a main window
const createWindow = () => {
  winMain = new BrowserWindow(winSettings);
  winMain.openDevTools();
  Menu.setApplicationMenu(null);

  winMain.loadURL('https://www.youtube.com');
  //   connectorRPC();
};

app.on('ready', () => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.releaseSingleInstanceLock();
