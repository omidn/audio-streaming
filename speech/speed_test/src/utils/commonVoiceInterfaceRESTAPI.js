"use strict";
import axios from 'axios';

class CommonVoiceInterfaceRESTAPI {
    constructor(options) {
        this.config = Object.assign({
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            },
            method: 'post'
        }, options);

        const urlBase = 'https://skill-edge.smartvoicehub.de/cvi/';
        const headerAuthorization = {
            'Authorization': 'Bearer ' +
                'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwb2MtdGVzdC11c2VyIiwiYXVkIjpbInN2aF9iYWNrZW5kIiwiY3ZpX2NvcmUiLCJ1c2VyX21hbmFnZW1lbnQiLCJldmVudF9oaXN0b3J5Il0sInRyYWNpbmciOmZhbHNlLCJuYmYiOjE1NDM5MTA4NjYsInByb2ZpbGUiOiJEZWZhdWx0IiwidGVzdGluZyI6ZmFsc2UsImlzcyI6InVzZXJfbWFuYWdlbWVudCIsImV4cCI6MTU0Mzk5NzI3MSwibG9jYWxlIjoiZGUiLCJpYXQiOjE1NDM5MTA4NzEsInRlbmFudCI6InNtYXJ0aHViX251YW5jZSJ9.F3q8Sb_zG4XqNoKbr4zGgeNO1A5jY85-r5BrsCyR8PA'
          };
        const apikey = '?apikey=b507d7ad-9e14-4a26-a3b5-0cc4ec2a2da9';

        this.requestConfig = {
            'User Login Skill-Edge': {
                url: urlBase + 'user/api/v1/login' + apikey,
                data: {
                    "externalToken": null,
                    "userId": "poc-test-user"
                }
            },
            'Text JSON': {
                headers: headerAuthorization,
                url: urlBase + 'dm/api/v1/invoke/text/json' + apikey,
                data: {
                    "externalToken": null,
                    "userId": "poc-test-user"
                }
            },
            'Audio JSON': {
                headers: {
                    ...headerAuthorization,
                    ...{
                        'Content-Type': 'audio/wav'
                    },
                },
                url: urlBase + 'dm/api/v1/invoke/audio/json' + apikey
            },
            'Text Multipart': {
                headers: {
                    ...headerAuthorization,
                    ...{
                        'Content-Type': 'application/json',
                        'responseType': 'blob'
                    },
                },
                url: urlBase + 'dm/api/v1/invoke/text/multipart' + apikey
            }


        }
    }

    request(requestName, requestData) {
        const requestConfig = this.requestConfig[requestName];
        let config = Object.assign(
            this.config,
            requestConfig);

        let data = Object.assign(
            requestData || {},
            requestConfig.data);

        let options = {
            ...config,
            data
        };

        console.log('requestName', requestName, 'options', options);

        let prom = axios(options).then(response => {
            return new Promise((resolve) => {
                console.log('##response', requestName, response);
                return resolve(response);
            })
        }).catch(err => {
            return new Promise((resolve, reject) => {
                console.log('ERROR', requestName, options);
                return reject(err);
            });
        });

        return prom;
    }

}


export default CommonVoiceInterfaceRESTAPI;