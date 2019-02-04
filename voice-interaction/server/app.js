const app = require('express')();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const speech = require('@google-cloud/speech');
const multer = require('multer');
const { Readable } = require('stream');
const fs = require('fs');

const client = new speech.SpeechClient();

// enable Cross Origin Resource Sharing
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
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
  };
  const [response] = await client.recognize(request);
  const r = response.results[0].alternatives[0];
  console.log({ transcript: r.transcript, confidence: r.confidence });
  res.json({ transcript: r.transcript, confidence: r.confidence });
  
  // const stream = new Readable({
  //   read(size) {
  //     this.push(req.file.buffer);
  //   }
  // });
  // stream.push(req.file.buffer.toString('base64'));
  const recognizerStream = client
        .streamingRecognize(request)
        .on('data', (d) => {
          const r = d.results[0].alternatives[0];
          res.json({ transcript: r.transcript, confidence: r.confidence });
        }).on('error', console.error);

  // recognizerStream.pipe(stream);
  // stream.pipe(recognizerStream);
  // stream.pipe(recognizerStream);
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
  let recognizerStream = null;

  const initRecognizer = () => {
    recognizerStream = client
      .streamingRecognize(request)
      .on('data', (d) => {
        const res = d.results[0].alternatives[0];
        socket.send({ transcript: res.transcript, confidence: res.confidence });
      }).on('error', console.error);
  };

  socket.on('message', (data) => {
    if (recognizerStream === null) {
      initRecognizer();
      console.log('a new recognizer initiated');
    }
    
    recognizerStream.write(data);
  });
  
  socket.on('disconnect', () => {
    if (recognizerStream) {
      console.log('a user is disconnected');
      recognizerStream.end();
      recognizerStream = null;
    }
  })
});


http.listen(5555, () => {
  console.log('app running on port 5555');
});
