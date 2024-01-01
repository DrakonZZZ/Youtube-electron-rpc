const rpcInfo = {
  largeImageKey: 'yt_1',
  largeImageText: 'Youtube Site',
  smallImageKey: 'yt_small',
  smallImageText: 'Opened in electron app',
};

const ytPause = (rpcInfo) => {
  delete rpcInfo.endTimestamp;
  rpcInfo.smallImageKey = 'pu';
  rpcInfo.smallImageText = 'Paused';
};

const ytPlay = (rpcInfo, videoName, author, videoUrl) => {
  rpcInfo.details = videoName;
  rpcInfo.state = '𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ' + author;
  rpcInfo.smallImageKey = 'pl_1';
  rpcInfo.smallImageText = 'Playing';
  rpcInfo.buttons = [{ label: 'Video Link', url: videoUrl }];
};
module.exports = { rpcInfo, ytPause, ytPlay };
