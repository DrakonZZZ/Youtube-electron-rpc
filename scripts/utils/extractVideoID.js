function getId(url, thumbId) {
  let urlParams = new URLSearchParams(new URL(url).search)
  let videoId = urlParams.get('v')
  let fullUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
    : thumbId
    ? thumbId
    : 'youtube-main'
  return fullUrl
}

module.exports = getId
