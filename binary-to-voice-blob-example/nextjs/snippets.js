		// console.log('res', res);
		// const json = await res.json();
		// // binary
		// const buffer = json.data;
		// const bytes = new Array(buffer.length);
		// for (let i = 0; i < buffer.length; i++) {
		// 	bytes[i] = buffer.charCodeAt(i);
		// }
		// const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/wav' });

		// base64
		/* const buffer = atob(base64);
			 var bytes = new Array(buffer.length);
			 for (var i = 0; i < buffer.length; i++) {
			 bytes[i] = buffer.charCodeAt(i);
			 }
			 console.log(new Uint8Array(bytes));
			 const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/wav' });
			 console.log('blob', const); */
		
		// try {
		// 	const url = window.URL.createObjectURL(blob);
		// 	this.setState({ src: url }, () => this.audio.play());
		// } catch(err) {
		// 	console.log('err', err);
		// }
