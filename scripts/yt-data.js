const { videoDivData, thumbnailId } = require('./fetcher')
const { rpcInfo, ytPause, ytPlay, rpcReset } = require('./rpcInfo')
const moment = require('moment')
const getId = require('./utils/extractVideoID')

hasSkipped = false

const ytData = async (win) => {
  try {
    let ytVideoData = await win.webContents.executeJavaScript(videoDivData)
    const thumbImg = await win.webContents.executeJavaScript(thumbnailId)

    if (ytVideoData) {
      let {
        videoName,
        author,
        videoUrl,
        videoLength,
        videoCurrentTime,
        isLive,
        videoPaused,
        viewCount,
      } = ytVideoData

      if (videoLength && videoCurrentTime) {
        if (!isLive) {
          if (!videoPaused) {
            let now = moment.utc(),
              remaining = moment.duration(
                videoLength - videoCurrentTime,
                'seconds'
              )
            endTimestamp = now.add(remaining).unix()
            global.hasSeeked =
              global.videoCurrentTimeTemp != Math.floor(endTimestamp)
            global.videoCurrentTimeTemp = Math.floor(endTimestamp)

            rpcInfo.endTimestamp = endTimestamp
            let thumbnailUrl = getId(videoUrl, thumbImg)
            rpcInfo.largeImageKey = thumbnailUrl
            ytPlay(rpcInfo, videoName, author, videoUrl, viewCount)
          } else {
            ytPause(rpcInfo)
          }
        } else {
          videoName = '[🔴]LIVE - ' + videoName
          if (!videoPaused) {
            rpcInfo.state = '𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ' + author
            rpcInfo.smallImageKey = 'live'
          } else {
            rpcInfo.state = '𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ' + author
          }
          rpcInfo.details = videoName
          rpcInfo.buttons = [
            { label: viewCount },
            { label: 'Watch', url: videoUrl },
          ]
        }
      } else {
        rpcReset(win)
      }
    } else {
      rpcReset(win)
    }

    if (globalThis.hasSeeked) {
      globalThis.hasSeeked = false
      return rpcInfo
    } else {
      return rpcInfo
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = ytData
