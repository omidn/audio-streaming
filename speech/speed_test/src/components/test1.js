import CommonVoiceInterfaceRESTAPI from './commonVoiceInterfaceRESTAPI_2';

const test1 =() => {
    const cviAPI = new CommonVoiceInterfaceRESTAPI();
    let requestName = 'Text JSON';
    let requestData = {"text": "Rezepte des tages"};

    const timerDom = document.getElementById('timer');
    let startDate = new Date();
    const cviAPIProm = cviAPI.request(requestName, requestData);

    cviAPIProm.then(response => {
        console.log('response', requestName, response);
    }).catch(err => {
            console.log('ERROR', requestName, err);
        }
    ).then(function () {
        console.log('ALWAYS');
        const endDate = new Date();
        let duration = endDate.getTime() - startDate.getTime();
        let time = duration / 1000;
        timerDom.innerHTML = time;
    });
};

export default test1;