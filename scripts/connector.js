const win = require('../main');
const { Client } = require('discord-rpc');

const rpc = new Client({ transport: 'ipc' });
const clientId = '623558135994384437';

const connectorRPC = (attempt = 0) => {
  if (attempt >= 5) {
    win.webContents.executeJavaScript(connectionStatus);
    return;
  }
  attempt += 1;
  rpc
    .login({ clientId })
    .catch((e) => setTimeout(() => connectorRPC(attempt), 1000));
};

module.exports = connectorRPC;
