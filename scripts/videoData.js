const { videoDivData, thumbnailId } = require('./utils/fetcher')

const fetchVideoData = async (win) => {
  try {
    return await win.webContents.executeJavaScript(videoDivData)
  } catch (error) {
    console.error('Error fetching video data:', error)
    throw error
  }
}

const fetchThumbnail = async (win) => {
  try {
    return await win.webContents.executeJavaScript(thumbnailId)
  } catch (error) {
    console.error('Error fetching thumbnail:', error)
    throw error
  }
}

module.exports = { fetchVideoData, fetchThumbnail }
