function logTimeStamp(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] - ${message}`);
}

module.exports = logTimeStamp;
