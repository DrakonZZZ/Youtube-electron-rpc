const channelDetail = `(function() {
  try {
    const detailDiv = document.querySelector("#channel-header-container");
    if (!detailDiv) {
      throw new Error("Detail div not found");
    }

    const imgElement = detailDiv.querySelector("#avatar #img").src;

    const subCountElement = detailDiv.querySelector("#subscriber-count");
    const subCount = subCountElement ? subCountElement.innerText.split(' ')[0] : null;

    const channelNameElement = detailDiv.querySelector("#channel-name #text");
    const channelName = channelNameElement ? channelNameElement.innerText : null;

    return {
      subCount: subCount,
      imgElement: imgElement ? imgElement : null,
      channelName: channelName
    };
  } catch (error) {
    console.error("Error extracting channel details:", error);
    return null;
  }
})()`

const videoDivData = `(function() {
  try {
    let win = document.title;
    let playerId = document.getElementById("movie_player");

    if (!playerId) {
      throw new Error("Player ID not found");
    }

    let videoData = playerId.getVideoData();
    let playerVideo = playerId.getElementsByTagName('video')[0];
    let videoLength = playerId.getDuration();
    let videoCurrentTime = playerId.getCurrentTime();
    let author = videoData.author;
    let videoName = videoData.title;
    let isLive = videoData.isLive;
    let videoPaused = playerVideo.paused;
    let videoUrl = "https://www.youtube.com/watch?v=" + videoData.video_id;

    const infoElement = document.querySelector("yt-formatted-string#info");

    if (!infoElement) {
      throw new Error("Info element not found");
    }

    const spans = infoElement.querySelectorAll("span");
    const viewCount = spans[0].innerText;
    return {
      videoName,
      author,
      videoUrl,
      videoLength,
      videoCurrentTime,
      win,
      isLive,
      videoPaused,
      viewCount
    };
  } catch (error) {
    console.error("Error extracting video data:", error);
    return null;
  }
})()`

const thumbnailId = `(function() {
  try {
    const imgDiv = document.getElementById("owner");
    const imgElement = imgDiv.querySelector('img');
    return imgElement ? imgElement.src : null;
  } catch (error) {
    console.error("Error extracting thumbnail ID:", error);
    return null;
  }
})()`

module.exports = {
  videoDivData,
  tempVideoCurrentTime: -1,
  thumbnailId,
  channelDetail,
}
