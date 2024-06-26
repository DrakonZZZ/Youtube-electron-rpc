const { channelDetail } = require('./utils/fetcher')
const { rpcInfo } = require('./rpcInfo')
const logTimeStamp = require('./utils/timestamp')
const regexPattern = require('./utils/regex')

const updateRpcInfo = async (win) => {
  try {
    const url = win.webContents.getURL()
    const pathname = new URL(url).pathname
    const parts = pathname.split('/')
    const channelPath = parts[1]

    const channelInfo = await win.webContents.executeJavaScript(channelDetail)

    rpcInfo.details = 'Browsing'
    rpcInfo.state = 'Homepage'
    rpcInfo.largeImageKey = channelInfo?.imgElement || 'yt-3'
    rpcInfo.smallImageKey = 'skullypng'
    rpcInfo.smallImageText = channelInfo?.subCount
      ? channelInfo.subCount
      : 'youtube'

    logTimeStamp(url)

    const channelSubs = channelInfo?.subCount
    const channelTag = channelInfo?.channelName

    const patterns = regexPattern(channelPath, url)

    let matched = false
    for (const { regex, state, largeImageKey, details, buttons } of patterns) {
      if (regex.test(url)) {
        rpcInfo.state = typeof state === 'function' ? state() : state
        if (largeImageKey !== undefined) rpcInfo.largeImageKey = largeImageKey

        if (details !== undefined) rpcInfo.details = details

        if (buttons === null) {
          delete rpcInfo.buttons
        } else {
          assignButtons(rpcInfo, channelSubs, channelTag, url)
        }
        matched = true
        break
      }
    }

    if (!matched) {
      rpcInfo.state = url
      rpcInfo.largeImageKey = 'yt-3'
      rpcInfo.smallImageKey = 'skullypng'
      delete rpcInfo.buttons
    }

    if (rpcInfo.endTimestamp) {
      delete rpcInfo.endTimestamp
    }
  } catch (error) {
    console.error('Error updating RPC info:', error)
  }
}

const assignButtons = (rpcInfo, subCount, channelTag, url) => {
  console.log(`subcount: ${subCount} and url: ${url}`)
  rpcInfo.buttons = [
    { label: channelTag, url },
    { label: `${subCount} • subscribers`, url },
  ]
}

module.exports = updateRpcInfo
