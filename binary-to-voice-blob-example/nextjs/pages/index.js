import React from 'react';
export default class extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			src: ''
		}
	}
	
	onClickHandler = async () =>  {
		const res = await fetch('http://localhost:3001/binary');
		const json = await res.json();
		// binary
		const buffer = json.data;
		const bytes = new Array(buffer.length);
		for (let i = 0; i < buffer.length; i++) {
			bytes[i] = buffer.charCodeAt(i);
		}
		const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/wav' });

		// base64
		/* const buffer = atob(base64);
			 var bytes = new Array(buffer.length);
			 for (var i = 0; i < buffer.length; i++) {
			 bytes[i] = buffer.charCodeAt(i);
			 }
			 console.log(new Uint8Array(bytes));
			 const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/wav' });
			 console.log('blob', const); */
		
		try {
			const url = window.URL.createObjectURL(blob);
			this.setState({ src: url }, () => this.audio.play());
		} catch(err) {
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
