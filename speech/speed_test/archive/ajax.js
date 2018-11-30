/**
 * Fires a http request with given parameters.
 *
 * @function fetch
 * @memberOf utils/helper
 * @param {Object} options
 */
// Access-Control-Allow-Origin' header is present on the requested resource.

const fetch = (options) => {
    // console.log('### Ajax: options', options, options.method);
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        console.log('##AJAX options.url:', options.url, 'options.method', options.method, options);

        request.open(options.method, options.url, true);

        if (options.timeout > 0) {
            request.timeout = options.timeout;
        }
        request.ontimeout = () => {
            reject(request);
        };

        request.withCredentials = false;

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                resolve(request);
            } else {
                reject(request);
            }

        };

        // define error/fail callback
        request.onerror = () => {
            reject(request);
        };

        const header = options.headers;
        for (const key in header) {
            const value = header[key];
            console.log('header.key', key, 'value', value);
            request.setRequestHeader(key, value);

        }

        request.send(options.data);
    })
};

export default fetch;