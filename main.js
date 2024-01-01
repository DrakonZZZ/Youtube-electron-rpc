const { app, BrowserWindow, Menu } = require('electron/main');
const { Client } = require('discord-rpc');
const ytData = require('./scripts/yt-data');

const rpc = new Client({ transport: 'ipc' });
const clientId = '623558135994384437';
// const pageLoad = __dirname + 'index.html';

let win,
  winModal,
  winSettings = {
    width: 1280,
    height: 720,
    useContentSize: false,
    backgroundColor: '#2e2c29',
    title: 'Youtube RPC',
    icon: __dirname + '/assets/yt.png',
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
    },
  },
  winModalSetting = {
    width: 500,
    height: 600,
  };

const connectorRPC = (attempt = 0) => {
  if (attempt >= 5) {
    win.webContents.executeJavaScript(connectionStatus);
    return;
  }
  attempt += 1;
  rpc
    .login({ clientId })
    .catch((e) => setTimeout(() => connectorRPC(attempt), 10e4));
};

const checkYtData = async () => {
  if (!rpc || !win) return;
  let data = await ytData(win);
  console.log(data);
  rpc.setActivity(data);
};

// creating a main window
const createWindow = () => {
  //main window
  win = new BrowserWindow(winSettings);

  //sencondary window for siging up or loggin
  winModal = new BrowserWindow(winModalSetting);

  winModal.hide();

  win.webContents.on('will-navigate', (e, url) => {
    uri = new URL(url).host;
    if ('accounts.google.com' == uri) {
      e.preventDefault();
      winModal.show();
      winModal.loadURL(url);
    }
  });

  win.openDevTools();
  Menu.setApplicationMenu(null);

  win.loadURL('https://www.youtube.com');
  connectorRPC();
};

rpc.on('ready', () => {
  checkYtData();
  setInterval(() => {
    checkYtData();
  }, 5e3);
});

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
