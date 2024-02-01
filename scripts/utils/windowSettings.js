const winModalSetting = {
  width: 500,
  height: 600,
};

const winSettings = {
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
};

module.exports = { winModalSetting, winSettings };
