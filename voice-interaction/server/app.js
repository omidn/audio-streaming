const app = require('express')();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const SocketStream = require('socket.io-stream');
const speech = require('@google-cloud/speech');
const multer = require('multer');
const fs = require('fs');

const client = new speech.SpeechClient();

const request = {
  config: {
    enableWordTimeOffsets: true,
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
  const buffer = req.file.buffer.toString('base64');
  const request = {
    audio: {
      content: buffer,
    },
    config: {
      encoding: 'LINEAR16',
      // sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
    interimResults: true,
  };
  const [response] = await client.recognize(request);
  const r = response.results[0].alternatives[0];
  console.log({ transcript: r.transcript, confidence: r.confidence });
  res.json({ transcript: r.transcript, confidence: r.confidence });
});
const createRecognizer = (socket) => {
  return client
    .streamingRecognize(request)
    .on('data', (res) => {
      const { transcript, confidence } = res.results[0].alternatives[0];
      
      socket.send(JSON.stringify({
        transcript, confidence
      }));
    }).on('error', console.error);
};


io.on('connection', (socket) => {
  const recognizeStream = createRecognizer(socket);
    
  socket.on('message', (data) => {
    recognizeStream.write(data);
  });
  
  socket.on('disconnect', () => {
    if (recognizeStream) {
      console.log('a user is disconnected');
      recognizeStream.end();
    }
  })
});


http.listen(5555, () => {
  console.log('app running on port 5555');
});
