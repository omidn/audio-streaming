"use strict";

class Recorder {
    constructor(options) {
        this.options = Object.assign({
            chunkSize: 500,
            dataType: {'type': 'audio/ogg'}
        }, options);

        this.chunks = [];
        this.mediaRecorder = null;
        this.onReadyCallbacks = [];
        this.onChunkCallbacks = [];
        this.blob = null;


        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            this.constraints = {
                audio: true
            };

            navigator.mediaDevices.getUserMedia(this.constraints).then((stream)=> {
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
        this.onReadyCallbacks.push(callback);
    }

    onChunk(callback) {
        this.onChunkCallbacks.push(callback);
    }

    start(chunkSize) {
        console.log('start this', this, this.mediaRecorder, this.options.chunkSize, this.options);
        this.mediaRecorder.start(chunkSize || this.options.chunkSize);
    }

    stop() {
        console.log('mediarecorder stop');
        this.mediaRecorder.stop();
    }

    saveData() {
        this.blob = new Blob(this.chunks, this.options.dataType);
        console.log('saveData from chunks blob 0, this.chunks', this.blob, this.chunks);
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

    resetBlob(){
        this.resetChunks();
    }

    // -------------------------------------------------------- //
    // -------- internal used only (is es7 only ------- //
    // -------------------------------------------------------- //

    handleStream(stream) {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = this.handleRecorderData.bind(this);

        this.triggerOnReadyEvent();
    }

    handleRecorderData(e) {
        let chunkBlob = e.data;

        this.chunks.push(chunkBlob);
        console.log('###### handleRecorderData chunkBlob', chunkBlob, this.chunks);

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
        for (let i = 0; i < this.onReadyCallbacks.length; i++) {
            this.onReadyCallbacks[i].bind(this)();
        }
    }

    triggerOnChunkEvent(chunkBlob) {
        for (let i = 0; i < this.onChunkCallbacks.length; i++) {
            this.onChunkCallbacks[i].bind(this)(chunkBlob);
        }
    }
}



export default Recorder;