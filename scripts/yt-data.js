const { videoDivData } = require('./fetcher');
const { rpcInfo, ytPause, ytPlay } = require('./rpcInfo');
const moment = require('moment');

hasSkipped = false;

const ytData = async (win) => {
  let ytVideoData = await win.webContents.executeJavaScript(videoDivData);
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
        rpcInfo.buttons = [{ label: 'Video Link', url: videoUrl }];
      }
    } else {
      rpcReset();
    }
  } else {
    rpcReset();
  }
  if (global.hasSeeked) {
    global.hasSeeked = false;
    return rpcInfo;
  } else {
    return rpcInfo;
  }
};

const rpcReset = () => {
  rpcInfo.details = 'Browsing';
  rpcInfo.state = 'Looking through video page';
  rpcInfo.smallImageKey = 'yt_small';
  if (rpcInfo.buttons) {
    delete rpcInfo.buttons;
  }
};

module.exports = ytData;
