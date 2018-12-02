import CommonVoiceInterfaceRESTAPI from '../utils/commonVoiceInterfaceRESTAPI';

const login = (callback) => {
    const cviAPI = new CommonVoiceInterfaceRESTAPI();
    let requestName = 'User Login Skill-Edge';

    const cviAPIProm = cviAPI.request(requestName);

    cviAPIProm.then(response => {
        console.log(response.data.token);
        if (callback) {
            callback(response)
        }
    }).catch(err => {
        console.log('ERROR', requestName, err);

    });
}

export default login;