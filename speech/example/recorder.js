"use strict";

let Recorder = function(options){
    let self = this;

    options = extend([{
        chunkSize: 500,
        dataType: { 'type' : 'audio/ogg' }
    }, options]);

    // -------------------------------------------------------- //

    let chunks = [];
    let mediaRecorder = null;
    let onReadyCallbacks = [];
    let onChunkCallbacks = [];
    let blob = null;

    // -------------------------------------------------------- //

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let constraints = {
            audio: true
        };

        navigator.mediaDevices.getUserMedia(constraints).then(handleStream).catch(e => {
            throw new AudioException('gUM exception: ' + e)
        });
    }
    else {
        throw new UnsupportedException('This browser doesn\'t support gUM.');
    }

    // -------------------------------------------------------- //

    self.getState = function(){
        return mediaRecorder.state;
    };

    self.onReady = function(callback){
        onReadyCallbacks.push(callback);

        return self;
    };

    self.onChunk = function(callback){
        onChunkCallbacks.push(callback);

        return self;
    };

    self.start = function(chunkSize){
        mediaRecorder.start(chunkSize || options.chunkSize);

        return self;
    };

    self.stop = function(){
        mediaRecorder.stop();

        return self;
    };

    self.saveData = function(){
        blob = new Blob(chunks, options.dataType);

        return self;
    };

    self.resetChunks = function(){
        resetChunks();

        return self;
    };

    self.resetBlob = function(){
        resetChunks();

        return self;
    };

    self.getChunks = function(){
        return chunks;
    };

    self.getBlob = function(){
        return blob;
    };

    self.getObjectUrl = function(){
        return window.URL.createObjectURL(blob);
    };

    self.getDataUrl = function(callback){
        var reader = new FileReader();

        reader.readAsDataURL(blob);
        reader.onloadend = e => callback(e.target.result);

        return self;
    };

    // -------------------------------------------------------- //

    function handleStream(stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleRecorderData;

        triggerOnReadyEvent();
    }

    function handleRecorderData(e) {
        let chunkBlob = e.data;

        chunks.push(chunkBlob);

        triggerOnChunkEvent(chunkBlob);
    }

    // -------------------------------------------------------- //

    function AudioException(message) {
        this.name = "AudioException";
        this.message = message;
    }

    function UnsupportedException(message) {
        this.name = "UnsupportedException";
        this.message = message;
    }

    // -------------------------------------------------------- //

    function resetChunks() {
        chunks = [];
    }

    function triggerOnReadyEvent() {
        for (let i = 0; i < onReadyCallbacks.length; i++) {
            onReadyCallbacks[i].bind(self)();
        }
    }

    function triggerOnChunkEvent(chunkBlob) {
        for (let i = 0; i < onChunkCallbacks.length; i++) {
            onChunkCallbacks[i].bind(self)(chunkBlob);
        }
    }

    function extend(objects) {
        let values = Object.keys(objects).map(function(e) {
            return objects[e]
        });

        return values.reduce(function (r, o) {
            Object.keys(o).forEach(function (k) {
                r[k] = o[k];
            });
            return r;
        }, {});
    }
};
