const app = require('express')();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const SocketStream = require('socket.io-stream');
const speech = require('@google-cloud/speech');
const multer = require('multer');
const { createRecognizer, client } = require('./recognizer');
const fs = require('fs');
const PORT = 5555

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
app.post('/upload', upload.single('file'), require('./upload')(client));

// handle socket packets
io.on('connection', (socket) => {
  const recognizeStream = createRecognizer(socket);
  let source = 'google';
  
  socket.on('source', (s) => {
    source = s;
  })

  socket.on('message', (buffer) => {
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
