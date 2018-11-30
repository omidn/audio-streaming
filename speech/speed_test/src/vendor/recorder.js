import InlineWorker from 'inline-worker';

export class Recorder {
    config = {
        bufferLen: 4096,
        numChannels: 2,
        mimeType: 'audio/wav',
        sampleRateOut: '16000'
    };

    recording = false;

    callbacks = {
        getBuffer: [],
        exportWAV: []
    };

    constructor(source, cfg) {
        Object.assign(this.config, cfg);
        this.context = source.context;
        this.node = (this.context.createScriptProcessor ||
            this.context.createJavaScriptNode).call(this.context,
            this.config.bufferLen, this.config.numChannels, this.config.numChannels);

        this.node.onaudioprocess = (e) => {
            if (!this.recording) return;

            var buffer = [];
            for (var channel = 0; channel < this.config.numChannels; channel++) {
                buffer.push(e.inputBuffer.getChannelData(channel));
            }
            this.worker.postMessage({
                command: 'record',
                buffer: buffer
            });
        };

        source.connect(this.node);
        this.node.connect(this.context.destination);    //this should not be necessary

        let self = {};
        this.worker = new InlineWorker(function () {
            let recLength = 0,
                recBuffers = [],
                sampleRate,
                numChannels;

            this.onmessage = function (e) {
                switch (e.data.command) {
                    case 'init':
                        init(e.data.config);
                        break;
                    case 'record':
                        record(e.data.buffer);
                        break;
                    case 'exportWAV':
                        exportWAV(e.data.type, 16000);
                        break;
                    case 'getBuffer':
                        getBuffer();
                        break;
                    case 'clear':
                        clear();
                        break;
                }
            };

            function init(config) {
                sampleRate = config.sampleRate;
                numChannels = config.numChannels;
                initBuffers();
            }

            function record(inputBuffer) {
                for (var channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel].push(inputBuffer[channel]);
                }
                recLength += inputBuffer[0].length;
            }

            // https://stackoverflow.com/questions/28227380/downsampling-a-pcm-audio-buffer-in-javascript
            // var downsampleBuffer = function (buffer, sampleRate, outSampleRate) {
            //     console.log('buffer, sampleRate, outSampleRate',buffer, sampleRate, outSampleRate);
            //     if (outSampleRate == sampleRate) {
            //         return buffer;
            //     }
            //     if (outSampleRate > sampleRate) {
            //         throw "downsampling rate show be smaller than original sample rate";
            //     }
            //     var sampleRateRatio = sampleRate / outSampleRate;
            //     var newLength = Math.round(buffer.length / sampleRateRatio);
            //     // var result = new Int16Array(newLength);
            //     var result = new Float32Array(newLength);
            //     var offsetResult = 0;
            //     var offsetBuffer = 0;
            //     while (offsetResult < result.length) {
            //         var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            //         var accum = 0, count = 0;
            //         for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            //             accum += buffer[i];
            //             count++;
            //         }
            //
            //         result[offsetResult] = Math.min(1, accum / count)*0x7FFF;
            //         offsetResult++;
            //         offsetBuffer = nextOffsetBuffer;
            //     }
            //     return result.buffer;
            // }

            // https://medium.com/creative-technology-concepts-code/recording-syncing-and-exporting-web-audio-1e1a1e35ef08

            // function exportWAV(type) {
            //     let buffers = [];
            //     for (let channel = 0; channel < numChannels; channel++) {
            //         buffers.push(mergeBuffers(recBuffers[channel], recLength));
            //     }
            //     let interleaved;
            //     if (numChannels === 2) {
            //         interleaved = interleave(buffers[0], buffers[1]);
            //     } else {
            //         interleaved = buffers[0];
            //     }
            //     let dataview = encodeWAV(interleaved);
            //     let audioBlob = new Blob([dataview], {type: type});
            //
            //     this.postMessage({command: 'exportWAV', data: audioBlob});
            // }

            function exportWAV(type, rate) {
                rate = rate || sampleRate;
                console.log('rate', rate);
                let buffers = [];
                for (let channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                }
                let interleaved;
                if (numChannels === 2) {
                    interleaved = interleave(buffers[0], buffers[1]);
                } else {
                    interleaved = buffers[0];
                }

                var downsampledBuffer = downsampleBuffer(interleaved, rate);
                let dataview = encodeWAV(downsampledBuffer, rate);
                // let dataview = encodeWAV(interleaved);
                let audioBlob = new Blob([dataview], {type: type});
                // this.postMessage(audioBlob);
                this.postMessage({command: 'exportWAV', data: audioBlob});
            }


            function downsampleBuffer(buffer, rate) {
                console.log('downsampleBuffer rate', rate, 'sampleRate', sampleRate, buffer);
                if (rate == sampleRate) {
                    return buffer;
                }
                if (rate > sampleRate) {
                    throw "downsampling rate show be smaller than original sample rate";
                }
                var sampleRateRatio = sampleRate / rate;
                var newLength = Math.round(buffer.length / sampleRateRatio);
                var result = new Float32Array(newLength);
                var offsetResult = 0;
                var offsetBuffer = 0;
                while (offsetResult < result.length) {
                    var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
                    var accum = 0, count = 0;
                    for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                        accum += buffer[i];
                        count++;
                    }
                    result[offsetResult] = accum / count;
                    offsetResult++;
                    offsetBuffer = nextOffsetBuffer;
                }
                console.log('result', result)
                return result;
            }


            function getBuffer() {
                let buffers = [];
                for (let channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                }
                this.postMessage({command: 'getBuffer', data: buffers});
            }

            function clear() {
                recLength = 0;
                recBuffers = [];
                initBuffers();
            }

            function initBuffers() {
                for (let channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel] = [];
                }
            }

            function mergeBuffers(recBuffers, recLength) {
                let result = new Float32Array(recLength);
                let offset = 0;
                for (let i = 0; i < recBuffers.length; i++) {
                    result.set(recBuffers[i], offset);
                    offset += recBuffers[i].length;
                }
                return result;
            }

            function interleave(inputL, inputR) {
                let length = inputL.length + inputR.length;
                let result = new Float32Array(length);

                let index = 0,
                    inputIndex = 0;

                while (index < length) {
                    result[index++] = inputL[inputIndex];
                    result[index++] = inputR[inputIndex];
                    inputIndex++;
                }
                return result;
            }

            function floatTo16BitPCM(output, offset, input) {
                for (let i = 0; i < input.length; i++, offset += 2) {
                    let s = Math.max(-1, Math.min(1, input[i]));
                    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            }

            function writeString(view, offset, string) {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }

            // function encodeWAV(samples) {
            //     let buffer = new ArrayBuffer(44 + samples.length * 2);
            //     let view = new DataView(buffer);
            //
            //     /* RIFF identifier */
            //     writeString(view, 0, 'RIFF');
            //     /* RIFF chunk length */
            //     view.setUint32(4, 36 + samples.length * 2, true);
            //     /* RIFF type */
            //     writeString(view, 8, 'WAVE');
            //     /* format chunk identifier */
            //     writeString(view, 12, 'fmt ');
            //     /* format chunk length */
            //     view.setUint32(16, 16, true);
            //     /* sample format (raw) */
            //     view.setUint16(20, 1, true);
            //     /* channel count */
            //     view.setUint16(22, numChannels, true);
            //     /* sample rate */
            //     view.setUint32(24, sampleRate, true);
            //     /* byte rate (sample rate * block align) */
            //     view.setUint32(28, sampleRate * 4, true);
            //     /* block align (channel count * bytes per sample) */
            //     view.setUint16(32, numChannels * 2, true);
            //     /* bits per sample */
            //     view.setUint16(34, 16, true);
            //     /* data chunk identifier */
            //     writeString(view, 36, 'data');
            //     /* data chunk length */
            //     view.setUint32(40, samples.length * 2, true);
            //
            //     floatTo16BitPCM(view, 44, samples);
            //
            //     return view;
            // }

            function encodeWAV(samples, rate) {
                let buffer = new ArrayBuffer(44 + samples.length * 2);
                let view = new DataView(buffer);

                /* RIFF identifier */
                writeString(view, 0, 'RIFF');
                /* RIFF chunk length */
                view.setUint32(4, 36 + samples.length * 2, true);
                /* RIFF type */
                writeString(view, 8, 'WAVE');
                /* format chunk identifier */
                writeString(view, 12, 'fmt ');
                /* format chunk length */
                view.setUint32(16, 16, true);
                /* sample format (raw) */
                view.setUint16(20, 1, true);
                /* channel count */
                view.setUint16(22, numChannels, true);
                /* sample rate */
                view.setUint32(24, rate, true);
                /* byte rate (sample rate * block align) */
                view.setUint32(28, rate * 4, true);
                /* block align (channel count * bytes per sample) */
                view.setUint16(32, numChannels * 2, true);
                /* bits per sample */
                view.setUint16(34, 16, true);
                /* data chunk identifier */
                writeString(view, 36, 'data');
                /* data chunk length */
                view.setUint32(40, samples.length * 2, true);

                floatTo16BitPCM(view, 44, samples);

                return view;
            }
            // function encodeWAV(samples){
            //     var buffer = new ArrayBuffer(44 + samples.length * 2);
            //     var view = new DataView(buffer);
            //
            //     /* RIFF identifier */
            //     writeString(view, 0, 'RIFF');
            //     /* RIFF chunk length */
            //     view.setUint32(4, 36 + samples.length * 2, true);
            //     /* RIFF type */
            //     writeString(view, 8, 'WAVE');
            //     /* format chunk identifier */
            //     writeString(view, 12, 'fmt ');
            //     /* format chunk length */
            //     view.setUint32(16, 16, true);
            //     /* sample format (raw) */
            //     view.setUint16(20, 1, true);
            //     /* channel count */
            //     view.setUint16(22, numChannels, true);
            //     /* sample rate */
            //     view.setUint32(24, sampleRate, true);
            //     /* byte rate (sample rate * block align) */
            //     view.setUint32(28, sampleRate * 4, true);
            //     /* block align (channel count * bytes per sample) */
            //     view.setUint16(32, numChannels * 2, true);
            //     /* bits per sample */
            //     view.setUint16(34, 16, true);
            //     /* data chunk identifier */
            //     writeString(view, 36, 'data');
            //     /* data chunk length */
            //     view.setUint32(40, samples.length * 2, true);
            //
            //     floatTo16BitPCM(view, 44, samples);
            //
            //     return view;
            // }
        }, self);

        this.worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
                numChannels: this.config.numChannels
            }
        });

        this.worker.onmessage = (e) => {
            let cb = this.callbacks[e.data.command].pop();
            if (typeof cb == 'function') {
                cb(e.data.data);
            }
        };
    }


    record() {
        this.recording = true;
    }

    stop() {
        this.recording = false;
    }

    clear() {
        this.worker.postMessage({command: 'clear'});
    }

    getBuffer(cb) {
        cb = cb || this.config.callback;
        if (!cb) throw new Error('Callback not set');

        this.callbacks.getBuffer.push(cb);

        this.worker.postMessage({command: 'getBuffer'});
    }

    exportWAV(cb, mimeType) {
        mimeType = mimeType || this.config.mimeType;
        cb = cb || this.config.callback;
        if (!cb) throw new Error('Callback not set');

        this.callbacks.exportWAV.push(cb);

        this.worker.postMessage({
            command: 'exportWAV',
            type: mimeType
        });
    }

    static
    forceDownload(blob, filename) {
        let url = (window.URL || window.webkitURL).createObjectURL(blob);
        let link = window.document.createElement('a');
        link.href = url;
        link.download = filename || 'output.wav';
        let click = document.createEvent("Event");
        click.initEvent("click", true, true);
        link.dispatchEvent(click);
    }
}

export default Recorder;