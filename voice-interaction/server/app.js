const app = require('express')();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const SocketStream = require('socket.io-stream');
const speech = require('@google-cloud/speech');
const multer = require('multer');
const fs = require('fs');

const PORT = 5555

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

// enable cross Origin Resource Sharing
app.use(cors());

// configure multer to parse incomming form-date
const storage = multer.memoryStorage();
const upload = multer({ storage });

// test route
app.get('/', (req, res) => {
  res.json({ test: 'ok' });
});

// upload file route
app.post('/upload', upload.single('file'), async (req, res) => {
  const [ response ] = await client.recognize({
    ...request,
    audio: {
      content: req.file.buffer.toString('base64'),
    }
  });
  
  const { transcript, confidence } = response.results[0].alternatives[0];
  res.json({ transcript, confidence });
});

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

// handle socket packets
io.on('connection', (socket) => {
  console.log('a user connected.');
  const recognizeStream = createRecognizer(socket);

  socket.on('message', (buffer) => {
    console.log('m', buffer);
    recognizeStream.write(buffer);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected.');
    
    if (recognizeStream) {
      recognizeStream.end();
    }
  })
});

http.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
