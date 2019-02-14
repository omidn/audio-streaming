const get = require('lodash/get');

const request = {
  config: {
    enableWordTimeOffsets: false,
    languageCode: 'en-US',
    sampleRateHertz: 16000,
    encoding: 'LINEAR16',
  },
  interimResults: false,
};

module.exports = client =>  async (req, res) => {
  const [ response ] = await client.recognize({
    ...request,
    audio: {
      content: req.file.buffer.toString('base64'),
    }
  });
  
  const { transcript, confidence } = get(response, 'results[0].alternatives[0]', {});
  res.json({ transcript, confidence });
};
