const { app, BrowserWindow, Menu } = require('electron/main');
const connectorRPC = require('./scripts/connector');

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
  console.log('working');
  connectorRPC();
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

module.exports = win;
