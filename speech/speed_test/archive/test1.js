import CommonVoiceInterfaceRESTAPI from '../utils/commonVoiceInterfaceRESTAPI';

const test1 = (opts) => {
    const options = Object.assign({
        text: 'Rezepte des tages',
        callback: {}
    }, opts);
    const cviAPI = new CommonVoiceInterfaceRESTAPI();
    let requestName = 'Text JSON';
    let requestData = {
        "text": options.text
    };

    const timerDom = document.getElementById('timer-1');
    const textOutputDom = document.getElementById('text-output-1');

    let startDate = new Date();
    const cviAPIProm = cviAPI.request(requestName, requestData);

    cviAPIProm.then(response => {
        let text = response.data.text;
        text = text.replace(/<[^>]+>/g, '');
        textOutputDom.innerHTML = text;
        // text = textOutputDom.innerText;
        console.log('text', text);
        // textOutputDom.innerHTML = text;
        textOutputDom.style = 'color:green';
        options.callback(text);

    }).catch(err => {
        console.log('ERROR', requestName, err);
    }).then(function () {
        const endDate = new Date();
        let duration = endDate.getTime() - startDate.getTime();
        let time = duration / 1000;
        timerDom.innerHTML = time;
        timerDom.style = 'color:green';

    });
};


export default test1;