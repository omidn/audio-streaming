"use strict";
//the whole config object as parameter is optional
import Recorder from './recorder.js';

const recorderUse = function () {
    let recorderU = new Recorder({
        //optional
        chunkSize: 100,
        //optional
        dataType: {'type': 'audio/ogg'}
    });


    let callbackOnReady = function () {


        const recordButton = document.getElementById('record-button');

        console.log('recordButton', recordButton)

        recordButton.addEventListener('click', () => {
            // console.log('click');
            if (recordButton.classList.contains('record-not-active')) {
                recordButton.classList.add('record-active');
                recordButton.classList.remove('record-not-active');
                console.log('start recording');
                this.start();
            } else {
                recordButton.classList.add('record-not-active');
                recordButton.classList.remove('record-active');
                console.log('stop recording');
                //Stop recording
                this.stop();

                //Combines the chunks to a single blob
                this.saveData();

                //Returns the processed data url of the audio file in a callback
                // this.getDataUrl(dataUrl => console.log(dataUrl));

                //Returns an array with all chunks
                this.getChunks();

                //Resets the chunks, after that, getChunks() will be empty
                this.resetChunks();

                //Returns a full blob, created by saveData()
                this.getBlob();
                console.log('Blob', this.getBlob());

                //Resets the blob, after that, getBlob() will be null
                this.resetBlob();

                //Returns the object url of the currently stored blob
                // this.getObjectUrl();
            }

            //Starts recording [optionally, you can overwrite the chunk size -> start(200)]

        });


        //Returns the state of the MediaRecorder interface instance
        // this.getState();

        //Triggers each time a chunk is full
        // this.onChunk(function (blob) {
        //     // console.log('onChunck', blob);
        // });


    }
//Triggers when the user accepted the microphone usage / when the gUM is loaded
    recorderU.onReady(callbackOnReady.bind(recorderU));

}

export default recorderUse;
