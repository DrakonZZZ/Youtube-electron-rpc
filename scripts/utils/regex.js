const channelRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+$/;
const featuredRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/channel$/;
const ShortsRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/shorts$/;
const videosRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/videos$/;
const playlistRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/playlists$/;
const streamRegex = /^https:\/\/www\.youtube\.com\/@[\w-]+\/streams$/;
const searchRegex = /^https:\/\/www\.youtube\.com\/results\?search_query/;

module.exports = {
  channelRegex,
  featuredRegex,
  ShortsRegex,
  videosRegex,
  playlistRegex,
  streamRegex,
  searchRegex,
};
