"use strict";
//the whole config object as parameter is optional
import Recorder from './recorder.js';
let recorderUse = new Recorder({
    //optional
    chunkSize: 500,
    //optional
    dataType: {'type': 'audio/ogg'}
});


let callbackOnReady = function(){

    //Starts recording [optionally, you can overwrite the chunk size -> start(200)]
    this.start();

    //Returns the state of the MediaRecorder interface instance
    this.getState();

    //Triggers each time a chunk is full
    this.onChunk(function (blob) {
        console.log(blob);
    });

    setTimeout(()=> {
        //Stop recording
        this.stop();

        //Combines the chunks to a single blob
        this.saveData();

        //Returns an array with all chunks
        this.getChunks();

        //Resets the chunks, after that, getChunks() will be empty
        this.resetChunks();

        //Returns a full blob, created by saveData()
        this.getBlob();

        //Resets the blob, after that, getBlob() will be null
        this.resetBlob();

        //Returns the object url of the currently stored blob
        this.getObjectUrl();

        //Returns the processed data url of the audio file in a callback
        this.getDataUrl(dataUrl => console.log(dataUrl));
    }, 1000);
}
//Triggers when the user accepted the microphone usage / when the gUM is loaded
recorderUse.onReady(callbackOnReady.bind(recorderUse));



export default recorderUse;
