const { channelDetail } = require('./fetcher')
const {
  featuredRegex,
  channelRegex,
  videosRegex,
  ShortsRegex,
  playlistRegex,
  streamRegex,
  searchRegex,
} = require('./utils/regex')
const logTimeStamp = require('./utils/timestamp')

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
    { label: 'Watch', url: videoUrl },
  ]
}

const assignButtons = (rpcInfo, subCount, channelTag, url) => {
  console.log(`subcount: ${subCount} and url: ${url}`)
  return (rpcInfo.buttons = [
    { label: channelTag, url },
    { label: subCount + ' • subscribers', url },
  ])
}

const rpcReset = async (win) => {
  const url = win.webContents.getURL()
  const pathname = new URL(url).pathname
  const parts = pathname.split('/')
  const channelName = parts[1]

  const channelInfo = await win.webContents.executeJavaScript(channelDetail)

  rpcInfo.details = 'Browsing'
  rpcInfo.state = 'Homepage'
  //rpcInfo.smallImageKey = '';

  rpcInfo.largeImageKey = channelInfo?.imgElement
    ? channelInfo.imgElement
    : 'youtube-main'

  logTimeStamp(url)

  let channelSubs = channelInfo?.subCount
  let channelTag = channelInfo?.channelName

  switch (true) {
    case featuredRegex.test(url):
      rpcInfo.state = `${channelName} • Featured videos`
      assignButtons(rpcInfo, channelSubs, channelTag, url)
      break
    case channelRegex.test(url):
      rpcInfo.state = `${channelName} • Channel`
      assignButtons(rpcInfo, channelSubs, channelTag, url)
      break
    case videosRegex.test(url):
      rpcInfo.state = `${channelName} • Videos`
      assignButtons(rpcInfo, channelSubs, channelTag, url)
      break
    case ShortsRegex.test(url):
      rpcInfo.state = `${channelName} • Shorts`
      assignButtons(rpcInfo, channelSubs, channelTag, url)
      break
    case playlistRegex.test(url):
      rpcInfo.state = `${channelName} • Playlist`
      assignButtons(rpcInfo, channelSubs, channelTag, url)
      break
    case streamRegex.test(url):
      rpcInfo.state = `${channelName} • streams`
      assignButtons(rpcInfo, channelSubs, channelTag, url)
      break
    case searchRegex.test(url): {
      const searchParams = new URLSearchParams(new URL(url).search)
      const query = searchParams.get('search_query')
      rpcInfo.state = `searching for ${query}`
      rpcInfo.largeImageKey = 'youtube-main'
      delete rpcInfo.buttons
      break
    }
    default:
      rpcInfo.state = url
      rpcInfo.largeImageKey = 'youtube-main'
      rpcInfo.smallImageKey = 'small-thumbpng'
      delete rpcInfo.buttons
      break
  }

  if (rpcInfo.endTimestamp) {
    delete rpcInfo.endTimestamp
  }
}

module.exports = { rpcInfo, ytPause, ytPlay, rpcReset }
