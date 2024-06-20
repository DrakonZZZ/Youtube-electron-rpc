// options {  largeImageKey: '',largeImageText: '',smallImageKey: '',smallImageText: '',startTimestamp: optional, endrTimeStamp:optional, buttons: []};
const rpcInfo = {
  largeImageKey: 'youtube-main',
  largeImageText: 'Youtube',
  smallImageKey: 'small-thumbpng',
  smallImageText: 'Youtube',
}

const ytPause = (rpcInfo) => {
  delete rpcInfo.endTimestamp
  rpcInfo.smallImageKey = 'yt-3pause'
  rpcInfo.smallImageText = 'Paused'
}

const ytPlay = (rpcInfo, videoName, author, videoUrl, viewCount) => {
  rpcInfo.details = videoName
  rpcInfo.state = '𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ' + author
  rpcInfo.smallImageKey = 'yt-3play'
  rpcInfo.smallImageText = 'Playing...'
  rpcInfo.buttons = [
    { label: 'Views: ' + viewCount, url: videoUrl },
    { label: 'Watch ▶', url: videoUrl },
  ]
}

module.exports = { rpcInfo, ytPause, ytPlay }
