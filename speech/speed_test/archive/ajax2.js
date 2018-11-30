/**
 * Fires a http request with given parameters.
 *
 * @function fetch
 * @memberOf utils/helper
 * @param {Object} options
 */
var fetch = function( options ) {
    return new Promise( function( resolve, reject ) {
        var request = new XMLHttpRequest();

        request.open( options.method, options.url, true );
        request.withCredentials = true;

        request.onload = function() {
            if ( request.status >= 200 && request.status < 400 ) {
                resolve( request );
            } else {
                reject( request );
            }

        };

        // define error/fail callback
        request.onerror = function( request ) {
            reject( request );
        };

        request.setRequestHeader( 'Content-Type', 'application/json' );

        // fetch
        if ( options.method.toUpperCase().indexOf( 'GET' ) >= 0 ) {
            request.send();
        }


        // else:
        if ( !options.data ) {
            console.error( 'Error: No data given for request' );
            return false;
        }

        if ( options.contentType !== 'html' ) {
            request.setRequestHeader( 'Content-Type', 'application/json' );
        } else {
            request.setRequestHeader( 'Content-Type', 'text/plain;charset=UTF-8' );
        }

        request.send( options.data );

    } )

};