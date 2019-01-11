const express = require('express');
const fs = require('fs');
const cors = require('cors');

const PORT = 3001;
const ROOT = './assets/';
const FILE_NAME = 'speech.wav';
const app = express();

app.use(cors());

const options = {
	root: ROOT,
}

app.get(['/test', '/'], (req, res) => {
	res.json({ test: 'ok' });
});

app.get('/audio', (req, res) => {
	res.sendFile(FILE_NAME , options, (err) => {
		if(err) {
			console.log('err', err);
		} else {
			console.log('request served successfuly');
		}
	})
});

app.get('/base64', (req, res) => {
	const buffer = fs.readFileSync(`${ROOT}${FILE_NAME}`, { encoding: 'base64' });
	res.json({
		test: 'ok',
		data: buffer
	});
});

app.get('/binary', (req, res) => {
	const buffer = fs.readFileSync(`${ROOT}${FILE_NAME}`, { encoding: 'binary' });
	res.json({
		test: 'ok',
		data: buffer
	});
});


app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
