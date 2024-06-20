const channelRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+$/
const featuredRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/channel$/
const shortsRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/shorts$/
const videosRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/videos$/
const playlistRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/playlists$/
const streamRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/streams$/
const searchRegex = /^https:\/\/www\.youtube\.com\/results\?search_query/

const regexPattern = (channelName, url) => [
  { regex: featuredRegex, state: `${channelName} • Featured videos` },
  { regex: channelRegex, state: `${channelName} • Channel` },
  { regex: videosRegex, state: `${channelName} • Videos` },
  { regex: shortsRegex, state: `${channelName} • Shorts` },
  { regex: playlistRegex, state: `${channelName} • Playlist` },
  { regex: streamRegex, state: `${channelName} • Streams` },
  {
    regex: searchRegex,
    state: () => {
      const searchParams = new URLSearchParams(new URL(url).search)
      const query = searchParams.get('search_query')
      return `𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿: ${query}`
    },
    largeImageKey: 'youtube-main',
    details: 'Search query',
    buttons: null,
  },
]

module.exports = regexPattern
