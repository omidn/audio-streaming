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
    languageCode: 'en-US', 
    // encoding: 'LINEAR16',
    // sampleRateHertz: 16000,
  },
  interimResults: true,
};

const recognizerStream = client
      .streamingRecognize(request)
      .on('data', (d) => {
        console.log('d', d);
      }).on('error', console.error);

io.on('connection', (socket) => {
  socket.on('message', (d) => {
    const data = Object.values(d);
    const buffer = new Int16Array(data, 0, Math.floor(data.byteLength / 2));
    // console.log('buffer', buffer);
    // Write the data chunk in the stream
    recognizerStream.write(buffer);
  });
  console.log('a user connected');
});

io.on('disconnect', (socket) => {
  console.log('a user disconnected');
});


http.listen(5555, () => {
    console.log('app running on port 5555');
});


// async function main() {
//   // The name of the audio file to transcribe
//   const fileName = './resources/speech.wav';
//   const file = fs.readFileSync(fileName);
//   const audioBytes = file.toString('base64');

//   // The audio file's encoding, sample rate in hertz, and BCP-47 language code
//   const audio = {
//     content: audioBytes,
//   };
//   const config = {
//     // encoding: 'LINEAR16',
//     // sampleRateHertz: 16000,
//     languageCode: 'en-US',
//   };
//   const request = {
//     audio: audio,
//     config: config,
//   };

//   // Detects speech in the audio file
//   const [response] = await client.recognize(request);
//   const transcription = response.results
//     .map(result => result.alternatives[0].transcript)
//     .join('\n');
//   console.log(`Transcription: ${transcription}`);
// }

// // ;main().catch(console.error);
