let tempVideoCurrentTime = -1;

let videoDivData = `(function(){
  win = null;
  playerId = null;
  try{win = document.title;}catch(err){}
  try{playerId = document.getElementById("movie_player");}catch(err){}
  videoLength = null
  videoCurrentTime = null
  videoName = null
  author = null
  isLive = null
  videoPaused = null
  videoUrl = null

  if (playerId){
      videoData = playerId.getVideoData();
      playerVideo = playerId.getElementsByTagName('video')[0];
      videoLength = playerId.getDuration();
      videoCurrentTime = playerId.getCurrentTime();
      author = videoData.author;
      videoName = videoData.title;
      isLive = videoData['isLive'];
      videoPaused = playerVideo.paused;
      console.log(videoData)
      videoUrl = "https://www.youtube.com/watch?v="+videoData.video_id;
      return {
          videoName,
          author,
          videoUrl,
          videoLength,
          videoCurrentTime,
          win,
          isLive,
          videoPaused,
      }

  }
  return null
  })()`;

const thumbnailId = `(function() {
    try {
      const  imgDiv= document.getElementById("owner");
      const imgElement = imgDiv.querySelector('img');
      return imgElement ? imgElement.src : null;
    } catch (error) {}
  })()`;

const channelDetail = `(function() {
  try {
    const detailDiv = document.getElementById("channel-header-container");
    const subCount = detailDiv.querySelector('#subscriber-count').innerText;
    const imgElement = detailDiv.querySelector('img');

    return {
      subCount: subCount,
      imgElement: imgElement.src ? imgElement.src : null
    };
  } catch (error) {}
})()
`;

module.exports = {
  videoDivData,
  tempVideoCurrentTime,
  thumbnailId,
  channelDetail,
};
