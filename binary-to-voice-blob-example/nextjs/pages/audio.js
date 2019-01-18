import React from 'react';
import { parse, stringify, break_by_line } from '../utils/parse';

const ENDPOINT = 'https://skill-edge.smartvoicehub.de/cvi/dm/api/v1/invoke/text/multipart?apikey=b507d7ad-9e14-4a26-a3b5-0cc4ec2a2da9';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwb2MtdGVzdC11c2VyIiwiYXVkIjpbInN2aF9iYWNrZW5kIiwiY3ZpX2NvcmUiLCJ1c2VyX21hbmFnZW1lbnQiLCJldmVudF9oaXN0b3J5Il0sInRyYWNpbmciOmZhbHNlLCJuYmYiOjE1NDc4MDkxNDksInByb2ZpbGUiOiJEZWZhdWx0IiwidGVzdGluZyI6ZmFsc2UsImlzcyI6InVzZXJfbWFuYWdlbWVudCIsImV4cCI6MTU0Nzg5NTU1NCwibG9jYWxlIjoiZGUiLCJpYXQiOjE1NDc4MDkxNTQsInRlbmFudCI6InNtYXJ0aHViX251YW5jZSJ9.OrMlJf8M7EeXYNNzaCMvuksWh8dTFDyWt9VOGu0ZlsM';

export default class extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			src: ''
		}
	}

	componentDidMount() {
		this.onClickHandler();
	}
	
	onClickHandler = async () =>  {
		try {
			const res = await fetch(ENDPOINT, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'accept': 'multipart/form-data',
					'authorization': TOKEN,
					'x-consumer-username': 'smarthub_nuance',
				},
				body: '{"text": "Wie ist das Wetter in Frankfurt?"}',
			});
      const text = await res.text();
      console.log('resp', text.length);
      
      const contentType = res.headers.get('content-type');
      const boundary = `--${contentType.split(';')[1].split('=')[1]}`;

      const reader = res.body.getReader();
      const { value, done }  = await reader.read();
      const lines = break_by_line(value);
      const audio = lines.slice(9).flat();
      
      /// this doesn't work
      // const buffer = new Uint8Array(audio.flat());
      // const audioCtx = new AudioContext();
      // audioCtx.decodeAudioData(buffer.buffer, function(data) {
      // }, (err) => console.log(err));

      // create the audio buffer manually
      const audioCtx = new AudioContext();
      const targetSampleRate = 16000;
      
      const audioBuffer = audioCtx.createBuffer(1, audio.length, targetSampleRate);
      const channel = audioBuffer.getChannelData(0);
      for (let i = 0; i < audio.length; i++) {
        const index = Math.round(targetSampleRate * i);
        channel[index] = audio[i] / 128. - 1 // Math.sin(audio[i] * Math.PI * 0.5)  // this has to be a number in [-1., 1.]
      }
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
		} catch (err) {
			console.log('err', err);
		}
	}

	render() {
		return (
			<section>
				<h1>Welcome to next.js!</h1>
				<audio ref={e => this.audio = e} controls src={this.state.src} />
				<button onClick={this.onClickHandler.bind(this)}>Click here</button>
			</section>
		);
	}
};
