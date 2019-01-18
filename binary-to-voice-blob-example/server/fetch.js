const request = require('request');
const toWav = require('audiobuffer-to-wav')

const ENDPOINT = 'https://skill-edge.smartvoicehub.de/cvi/dm/api/v1/invoke/text/multipart?apikey=b507d7ad-9e14-4a26-a3b5-0cc4ec2a2da9';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwb2MtdGVzdC11c2VyIiwiYXVkIjpbInN2aF9iYWNrZW5kIiwiY3ZpX2NvcmUiLCJ1c2VyX21hbmFnZW1lbnQiLCJldmVudF9oaXN0b3J5Il0sInRyYWNpbmciOmZhbHNlLCJuYmYiOjE1NDc3MjIzNTUsInByb2ZpbGUiOiJEZWZhdWx0IiwidGVzdGluZyI6ZmFsc2UsImlzcyI6InVzZXJfbWFuYWdlbWVudCIsImV4cCI6MTU0NzgwODc2MCwibG9jYWxlIjoiZGUiLCJpYXQiOjE1NDc3MjIzNjAsInRlbmFudCI6InNtYXJ0aHViX251YW5jZSJ9.UQRvMVpKrZvECPKyCJwJoqhXjgYT1G5eJg67NJFMRWc';

request.post({
  url: ENDPOINT,
  headers: {
		'content-type': 'application/json',
		'accept': 'multipart/form-data',
		'authorization': TOKEN,
		'x-consumer-username': 'smarthub_nuance',
	},
 	body: '{"text": "Wie ist das Wetter in Frankfurt?"}',
}, (err, res, body) => {
  const contentType = res.headers['content-type'];
  const delim = contentType.split(';')[1].split('=')[1];
  const endDlim =  "--" + delim
  
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.indexOf(endDlim) > -1) {
      console.log('line', i, line);
    }
  }
  audio = lines.slice(6, lines.length - 2).join('');
  const buffer = new ArrayBuffer(audio.length);
  for (let i = 0; i < audio.length; i++) {
    buffer[i] = audio.charCodeAt(i);
  }

  console.log('buf', toWav(buffer));
});
