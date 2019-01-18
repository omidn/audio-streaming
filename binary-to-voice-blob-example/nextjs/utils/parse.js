const LINE_BREAK = '\n';
const multipart = require('parse-multipart');

export const stringify = (bytes) => {
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return str;
}

export const break_by_line = (value) => {
  let counter = 0, buffer = [], lines = [];
  while(counter < value.length) {
    if (value[counter] === 10) {
      lines.push(buffer);
      buffer = [];
    } else {
      buffer.push(value[counter]);
    }
    counter++;
  }

  return lines;
}

export const parse = (text) => {
	const delim = text.split(LINE_BREAK)[0].substr(2);
	const parts = text.split(delim).slice(1, 3);

	// parse header
	const header = parts[0].split(LINE_BREAK)[4];

	// parse body
	const body = parts[1].split(LINE_BREAK);
	let b = body.slice(4, body.length - 3);
	const buffer = body.slice(4, body.length - 3).join('');
	const bytes = new Array(buffer.length);
	for (let i = 0; i < buffer.length; i++) {
		bytes[i] = buffer.charCodeAt(i);
	}

  return new Uint8Array(bytes);
  
	// const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/wav' });
	// console.log('blob', blob);
	// return blob; 
}
