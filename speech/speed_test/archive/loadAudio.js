// Audio Input

import axios from 'axios';

class LoadAudio {
    constructor(options) {
        this.config = Object.assign({
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            },
            method: 'get',
            responseType: 'arraybuffer'
            // responseType: 'stream'
        }, options);

    }

    loadFile(url) {
        // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // const source = audioCtx.createBufferSource();


        let options = {
            ...this.config,
            url: url
        };

        // console.log('options', options);

        let prom = axios(options).then(response => {
            return new Promise((resolve) => {
                return resolve(response);
            })
        }).catch(err => {
            return new Promise((resolve, reject) => {
                console.log('ERROR with this options:', options);
                return reject(err);
            });
        });

        return prom;
    }

}


export default LoadAudio;