const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

const request = {
  config: {
    enableWordTimeOffsets: false,
    languageCode: 'en-US',
    sampleRateHertz: 16000,
    encoding: 'LINEAR16',
  },
  interimResults: false,
};

const createRecognizer = (socket) => {
  return client
    .streamingRecognize(request)
    .on('data', (res) => {
      const { transcript, confidence } = res.results[0].alternatives[0];

      socket.send(JSON.stringify({
        transcript, confidence,
      }));
    }).on('error', console.error);
};

module.exports = {
  createRecognizer,
  client,
};
