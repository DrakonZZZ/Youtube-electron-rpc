function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${hours ? hours + ':' : ''}${formattedMinutes}:${formattedSeconds}`;
}

function formatTimeDisplay(currentTime, duration) {
  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  return `${formattedCurrentTime} / ${formattedDuration}`;
}

module.exports = formatTime;
