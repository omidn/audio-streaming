const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const speech = require('@google-cloud/speech');
const fs = require('fs');
const client = new speech.SpeechClient();

app.get('/', (req, res) => {
  res.json({ test: 'ok' });
});

const request = {
  config: {
    enableWordTimeOffsets: true,
    languageCode: 'en-US',
    sampleRateHertz: 16000,
    encoding: 'LINEAR16',
  },
  interimResults: false,
};

io.on('connection', (socket) => {
  console.log('a user connected');
  
  const recognizerStream = client
        .streamingRecognize(request)
        .on('data', (d) => {
          const res = d.results[0].alternatives[0];
          socket.send({ transcript: res.transcript, confidence: res.confidence });
        }).on('error', console.error);
  
  socket.on('message', (data) => {
    recognizerStream.write(data);
  });
  
  socket.on('disconnect', () => {
    console.log('a user is disconnected');
    recognizerStream.end();
  })
});




http.listen(5555, () => {
  console.log('app running on port 5555');
});
