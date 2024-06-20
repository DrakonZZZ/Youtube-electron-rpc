const { rpcInfo, ytPause, ytPlay } = require('./rpcInfo')
const { fetchVideoData, fetchThumbnail } = require('./videoData')
const moment = require('moment')
const getId = require('./utils/extractVideoID')
const rpcUpdate = require('./rpcUpdate')

let hasSkipped = false

const updateRpcForPlayingVideo = (ytVideoData, thumbImg) => {
  const {
    videoName,
    author,
    videoUrl,
    videoLength,
    videoCurrentTime,
    viewCount,
  } = ytVideoData

  const now = moment.utc()
  const remaining = moment.duration(videoLength - videoCurrentTime, 'seconds')
  const endTimestamp = now.add(remaining).unix()

  const hasSeeked = global.videoCurrentTimeTemp !== Math.floor(endTimestamp)
  global.videoCurrentTimeTemp = Math.floor(endTimestamp)

  rpcInfo.endTimestamp = endTimestamp
  rpcInfo.largeImageKey = getId(videoUrl, thumbImg)

  ytPlay(rpcInfo, videoName, author, videoUrl, viewCount)

  return hasSeeked
}

const updateRpcForPausedVideo = () => {
  ytPause(rpcInfo)
}

const updateRpcForLiveVideo = (ytVideoData) => {
  const { videoName, author, videoUrl, viewCount, videoPaused } = ytVideoData

  const liveVideoName = `[🔴]LIVE - ${videoName}`
  rpcInfo.state = `𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ${author}`
  rpcInfo.details = liveVideoName
  rpcInfo.smallImageKey = videoPaused ? null : 'live'
  rpcInfo.buttons = [{ label: viewCount }, { label: 'Watch ▶', url: videoUrl }]
}

const ytData = async (win) => {
  try {
    const ytVideoData = await fetchVideoData(win)
    const thumbImg = await fetchThumbnail(win)

    if (!ytVideoData) {
      rpcUpdate(win)
      return rpcInfo
    }

    const { isLive, videoPaused, videoLength, videoCurrentTime } = ytVideoData

    if (!isLive) {
      if (videoLength && videoCurrentTime) {
        const hasSeeked = !videoPaused
          ? updateRpcForPlayingVideo(ytVideoData, thumbImg)
          : updateRpcForPausedVideo()

        if (globalThis.hasSeeked) {
          globalThis.hasSeeked = false
          return rpcInfo
        }
      } else {
        rpcReset(win)
      }
    } else {
      updateRpcForLiveVideo(ytVideoData)
    }

    return rpcInfo
  } catch (error) {
    console.error('Error processing YouTube data:', error)
    return rpcInfo
  }
}

module.exports = ytData
