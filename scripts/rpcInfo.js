const { channelDetail } = require('./fetcher');

const rpcInfo = {
  largeImageKey: 'youtube-main',
  largeImageText: 'Youtube',
  smallImageKey: 'small-thumbpng',
  smallImageText: 'Opened in electron app',
};

const ytPause = (rpcInfo) => {
  delete rpcInfo.endTimestamp;
  rpcInfo.smallImageKey = 'pause';
  rpcInfo.smallImageText = 'Paused';
};

const ytPlay = (rpcInfo, videoName, author, videoUrl) => {
  rpcInfo.details = videoName;
  rpcInfo.state = '𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ' + author;
  rpcInfo.smallImageKey = 'play';
  rpcInfo.smallImageText = 'Playing';
  rpcInfo.buttons = [{ label: 'Watch', url: videoUrl }];
};

const assignButtons = (rpcInfo, subCount, url) => {
  return (rpcInfo.buttons = [
    { label: 'Channel', url },
    { label: subCount, url },
  ]);
};

const rpcReset = async (win) => {
  const url = win.webContents.getURL();
  const pathname = new URL(url).pathname;
  const parts = pathname.split('/');
  const channelName = parts[1];

  const channelInfo = await win.webContents.executeJavaScript(channelDetail);

  rpcInfo.details = 'Browsing';
  rpcInfo.state = 'Homepage';
  rpcInfo.smallImageKey = 'small-thumbpng';
  rpcInfo.largeImageKey = channelInfo.imgElement
    ? channelInfo.imgElement
    : 'youtube-main';

  const channelRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+$/;
  const featuredRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/channel$/;
  const ShortsRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/shorts$/;
  const videosRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/videos$/;
  const playlistRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/playlists$/;
  const streamRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/streams$/;
  const searchRegex = /^https:\/\/www\.youtube\.com\/results\?search_query/;

  switch (true) {
    case featuredRegex.test(url):
      rpcInfo.state = `${channelName}\ Featured videos`;
      assignButtons(rpcInfo, channelInfo.subCount, url);
      break;
    case channelRegex.test(url):
      rpcInfo.state = `${channelName}\ Channel`;
      assignButtons(rpcInfo, channelInfo.subCount, url);
      break;
    case videosRegex.test(url):
      rpcInfo.state = `${channelName}\ Videos`;
      assignButtons(rpcInfo, channelInfo.subCount, url);
      break;
    case ShortsRegex.test(url):
      rpcInfo.state = `${channelName}\ Shorts`;
      assignButtons(rpcInfo, channelInfo.subCount, url);
      break;
    case playlistRegex.test(url):
      rpcInfo.state = `${channelName}\ Playlist`;
      assignButtons(rpcInfo, channelInfo.subCount, url);
      break;
    case streamRegex.test(url):
      rpcInfo.state = `${channelName}\ streams`;
      assignButtons(rpcInfo, channelInfo.subCount, url);
      break;
    case searchRegex.test(url): {
      const searchParams = new URLSearchParams(new URL(url).search);
      const query = searchParams.get('search_query');
      rpcInfo.state = `searching for ${query}`;
      break;
    }
    default:
      rpcInfo.state = url;
      rpcInfo.largeImageKey = 'youtube-main';
      delete rpcInfo.buttons;
      break;
  }

  if (rpcInfo.endTimestamp) {
    delete rpcInfo.endTimestamp;
  }
};

module.exports = { rpcInfo, ytPause, ytPlay, rpcReset };
