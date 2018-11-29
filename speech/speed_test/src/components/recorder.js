"use strict";

class Recorder {
    constructor(options) {
        this.options = Object.assign({
            chunkSize: 500,
            // mimeType: {'mimeType': 'audio/ogg'}
            mimeType: {'mimeType': 'audio/wav'}
        }, options);

        this.chunks = [];
        this.mediaRecorder = null;
        // this.onReadyCallbacks = [];
        // this.onChunkCallbacks = [];
        this.blob = null;


        if (navigator.mediaDevices.getUserMedia) {
            this.constraints = {
                audio: true
            };

            navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
                this.handleStream(stream);

            }).catch(e => {
                throw new this.AudioException('gUM exception: ' + e)
            });
        }
        else {
            throw new this.UnsupportedException('This browser doesn\'t support gUM.');
        }

    }

    getState() {
        return this.mediaRecorder.state;
    }

    onReady(callback) {
        // this.onReadyCallbacks.push(callback);
        // callback();
        this.onReadyCallback = callback;
    }

    onChunk(callback) {
        // this.onChunkCallbacks.push(callback);
        this.onChunkCallback = callback;
        // callback();
    }

    start(chunkSize) {
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start
        // timeslice
        this.mediaRecorder.start(chunkSize || this.options.chunkSize);
    }

    stop() {
        this.mediaRecorder.stop();
    }

    saveData() {
        this.blob = new Blob(this.chunks, {type: this.options.mimeType.mimeType});

        var fileReader = new FileReader();
        var arrayBuffer;
        // needed: Float32Array

        // [[Int8Array]]: Int8Array(20301) [26, 69, -33, -93, -97, 66, -122, -127, 1, 66, -9, -127, 1, 66, -14, -127, 4, 66, -13, -127, 8, 66, -126, -124, 119, 101, 98, 109, 66, -121, -127, 4, 66, -123, -127, 2, 24, 83, -128, 103, 1, -1, -1, -1, -1, -1, -1, -1, 21, 73, -87, 102, -103, 42, -41, -79, -125, 15, 66, 64, 77, -128, -122, 67, 104, 114, 111, 109, 101, 87, 65, -122, 67, 104, 114, 111, 109, 101, 22, 84, -82, 107, -65, -82, -67, -41, -127, 1, 115, -59, -121, -118, -3, -63, 102, 37, 24, -33, -125, -127, …]
        // [[Uint8Array]]: Uint8Array(20301)
        fileReader.onload = (event) => {
            arrayBuffer = event.target.result;
            console.log('arrayBuffer', arrayBuffer, typeof arrayBuffer);
            // console.log('b64ToFloat32', this.b64ToFloat32(arrayBuffer));
            // var view = new Float32Array(arrayBuffer);
            //     console.log('view', view);
            // var view = new DataView(arrayBuffer);
            // view.setFloat32();
            // console.log('view', view);
            // var float32Array = Float32Array.from(arrayBuffer);
            // console.log('float32Array', float32Array);
        };
        fileReader.readAsArrayBuffer(this.blob);
        // fileReader.readAsDataURL(this.blob);
    }

    b64ToFloat32(blobStr) {
        var blob	= window.atob(blobStr),	// Base64 string converted to a char array
            fLen	= blob.length / Float32Array.BYTES_PER_ELEMENT,						// How many floats can be made, but be even
            dView	= new DataView( new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT) ),	// ArrayBuffer/DataView to convert 4 bytes into 1 float.
            fAry	= new Float32Array(fLen),											// Final Output at the correct size
            p		= 0;																// Position

        for(var j=0; j < fLen; j++){
            p = j * 4;
            dView.setUint8(0,blob.charCodeAt(p));
            dView.setUint8(1,blob.charCodeAt(p+1));
            dView.setUint8(2,blob.charCodeAt(p+2));
            dView.setUint8(3,blob.charCodeAt(p+3));
            fAry[j] = dView.getFloat32(0,true);
        }
    }


    getChunks() {
        return this.chunks;
    }

    getBlob() {
        return this.blob;
    }

    getObjectUrl() {
        return window.URL.createObjectURL(this.blob);
    }

    getDataUrl(callback) {
        var reader = new FileReader();
        console.log('getDataUrl blob 1', this.blob);
        reader.readAsDataURL(this.blob);
        reader.onloadend = e => callback(e.target.result);
    }

    resetChunks() {
        this.chunks = [];
    }

    resetBlob() {
        this.resetChunks();
    }

    // -------------------------------------------------------- //
    // -------- internal used only (is es7 only ------- //
    // -------------------------------------------------------- //

    handleStream(stream) {
        console.log('Handle Stream');
        // const opt = {
        //     ...this.options.mimeType
        // };
        // console.log('opt', opt);
        // wav/audio not supported!
        // console: ...the type provided (audio/wav) is not supported."}
        this.mediaRecorder = new MediaRecorder(stream);

        var canRecord = MediaRecorder.isTypeSupported("audio/wav;codecs=MS_PCM");
        console.log('canRecord', canRecord);

        this.mediaRecorder.ondataavailable = this.handleRecorderData.bind(this);

        this.triggerOnReadyEvent();
    }

    handleRecorderData(e) {
        let chunkBlob = e.data;

        this.chunks.push(chunkBlob);
        // type: "audio/webm;codecs=opus"}
        // console.log('###### handleRecorderData chunkBlob', chunkBlob, this.chunks);
        // console.log(e.data);

        this.triggerOnChunkEvent(chunkBlob);
    }

    // -------------------------------------------------------- //

    AudioException(message) {
        this.name = "AudioException";
        this.message = message;
    }

    UnsupportedException(message) {
        this.name = "UnsupportedException";
        this.message = message;
    }

    // -------------------------------------------------------- //


    triggerOnReadyEvent() {
        this.onReadyCallback.bind(this)();
    }

    triggerOnChunkEvent(chunkBlob) {
        if ( this.onChunkCallback ) {
            this.onChunkCallback.bind(this)(chunkBlob);
        }

    }
}


export default Recorder;