const { videoDivData, thumbnailId } = require('./fetcher');
const { rpcInfo, ytPause, ytPlay, rpcReset } = require('./rpcInfo');
const moment = require('moment');

hasSkipped = false;

const ytData = async (win) => {
  try {
    let ytVideoData = await win.webContents.executeJavaScript(videoDivData);
    const thumbImg = await win.webContents.executeJavaScript(thumbnailId);

    if (ytVideoData) {
      let {
        videoName,
        author,
        videoUrl,
        videoLength,
        videoCurrentTime,
        isLive,
        videoPaused,
      } = ytVideoData;
      if (videoLength && videoCurrentTime) {
        if (!isLive) {
          if (!videoPaused) {
            let now = moment.utc(),
              remaining = moment.duration(
                videoLength - videoCurrentTime,
                'seconds'
              );
            endTimestamp = now.add(remaining).unix();
            global.hasSeeked =
              global.videoCurrentTimeTemp != Math.floor(endTimestamp);
            global.videoCurrentTimeTemp = Math.floor(endTimestamp);

            rpcInfo.endTimestamp = endTimestamp;
            rpcInfo.largeImageKey = thumbImg ? thumbImg : 'youtube-main';
            ytPlay(rpcInfo, videoName, author, videoUrl);
          } else {
            ytPause(rpcInfo);
          }
        } else {
          videoName = '[🔴]LIVE - ' + videoName;
          if (!videoPaused) {
            rpcInfo.state = '𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ' + author;
          } else {
            rpcInfo.state = '𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ' + author;
          }
          rpcInfo.details = videoName;
          rpcInfo.buttons = [{ label: 'Watch', url: videoUrl }];
        }
      } else {
        rpcReset(win);
      }
    } else {
      rpcReset(win);
    }
    
    if (global.hasSeeked) {
      global.hasSeeked = false;
      return rpcInfo;
    } else {
      return rpcInfo;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = ytData;
