/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Can be used to send http requests to any url. Attend that synchronous requests are not supported at the
 *          moment. You can send a single request or multiple requests at the same time.
 */
function HttpRequest () {
    
    /**
     * Holds the base url.
     * 
     * @type String
     *
     * @see HttpRequest#setBaseUrl
     * 
     * @private
     */
    this.baseUrl             = null;
    
    /**
     * A given callback method will be executed in this context. This means you can access the properties of the context
     * object within the callback using 'this'. 
     *
     * @see HttpRequest#setContext
     * 
     * @type Object
     */
    this.context            = null;

    /**
     * Holds each registered call in this array. This gives us the possiblity to send all these registered calls
     * at the same time. Each registered call is an object containing the following properties:
     * Object ( [parameter] => [GET parameter/ Query part of an url mapped to an object]
     *          [callback]  => [Callback function] )
     * 
     * @type Array
     */
    this.registeredCalls    = [];

    /**
     * Couns each received response since multiple requests (simultaneously) has been fired. As soon as the number of
     * received calls is equal to the number of registered calls, we are able to call another callback therefore.
     * This event/callback 'allResultsReceived' can be used for example to trigger the render process or do some other
     * final work.
     *
     * @default "0"
     * 
     * @type int
     */
    this.numReceivedCalls   = 0;

    /**
     * We have to inform the user if no network connection is available. Apple requires this. Additionally we want to
     * inform the user if the request timed out or the url does not exist. As there is the possibilty to send multiple
     * requests simultaneously we do not want to inform the user more than once in such a case.
     * Is 'true' as soon as the user has received a notification about one of these issues at least once, 
     * false otherwise. 
     * 
     * @default "false"
     *
     * @type boolean
     */
    this.errorMessageSent = false;
    
    /**
     * Disables the notification of an error message to the user on any error. Disable this only if a request is totally 
     * unimportant and does not effect the app. This is important because Apple requires to inform the user if 
     * no network connection is available.
     * 
     * @default "true"
     *
     * @type boolean
     */
    this.sendErrors = true;
    
    /**
     * The handleAs parameter specifices how to parse the received data before the callback method is called.
     * Supported values are 'json', 'xml' and 'text'.
     * 
     * @default "text"
     *
     * @type string
     */
    this.handleAs = 'text';

    /**
     * Registers a request to send it simultaneously with other requests afterwards.
     * 
     * @param {Object}     [parameter]  {@link HttpRequest#handle}   
     * @param {Function}   [callback]   {@link HttpRequest#handle}   
     * 
     * @type null
     */
    this.registerCall = function (parameter, callback) {

        this.registeredCalls.push({parameter: parameter, 
                                   callback: callback});
        
    };

    /**
     * Fires each previous registered requests nearly simultaneous.
     * 
     * @param {Function}    onAllResultsReceivedCallback   This callback method is called as soon as all results has
     *                                                     been received. The method will be executed in the previous
     *                                                     set context. This method is called even if one of the 
     *                                                     requests failed.
     * 
     * @type null
     */
    this.sendRegisteredCalls  = function (onAllResultsReceivedCallback) {
    
        this.numReceivedCalls = 0;
        
        this.onAllResultsReceivedCallback = onAllResultsReceivedCallback;
        
        var call = null;
        
        for (var index = 0; index < this.registeredCalls.length; index++) {
            call = this.registeredCalls[index];

            this.handle(call.parameter, call.callback);
        }
    };

    /**
     * Sets (overwrites) the base url Attend that you can not send multiple requests to different base urls. 
     * You have to create different instances of this class in such a case.
     * 
     * @param {string} baseUrl   An url without any GET parameter/Query. For example: 'http://domain.tld/dir/ectory'.
     *                           Do not include GET parameter like this 'http://domain.tld/dir/ectory?' or 
     *                           'http://domain.tld/dir/ectory?key=1&key2=2'.
     * 
     * @type null
     */
    this.setBaseUrl  = function (baseUrl) {
    
        if (baseUrl && 'string' === (typeof baseUrl).toLowerCase() && 4 < baseUrl.length) {
            this.baseUrl = baseUrl;
        }
        
    };

    /**
     * Sets (overwrites) the context. Attend that you can not execute multiple requests in different context. All 
     * received results will be executed in the same context. You have to create different instances of this class 
     * in such a case.
     * 
     * @param {Object}   context   A given callback method will be executed in this context. This means you can access 
     *                             the properties of the context object within the callback using 'this'. 
     * 
     * @type null
     */
    this.setContext  = function (context) {
        this.context = context;
    };

    /**
     * Fires a single http request and calls the callback method as soon as the response is received. The callback is
     * called even on any error. Possible errors are: Network is not available, no base url is given, timeout, ...
     * In such a case the callback method does not receive the response as an argument. Ensure that your callback 
     * method is able to handle such a case.
     * 
     * @param   {Object}     [parameter]    Optional HTTP GET url parameters in the following format: 
     *                                      Object ( [key] => [value] ). Example:
     *                                      {token: '1234', method: 'abc'} results in ?token=1234&method=abc
     *                                      The url parameter are automatically appended to a previous set base url.
     * @param   {Function}   [callback]     An optional callback function.
     *
     * @type null
     */
    this.handle = function (parameter, callback) {

        if (!parameter) {
            parameter    = {};
        }
        
        if (!this.context) {
            this.context = {};
        }
        
        if (!callback) {
            callback     = function () {};
        }
        
        var _this = this;
        
        var errorHandler = function (e) {

            _this.numReceivedCalls++;
            
            Log.warn(e, 'Can not receive HttpRequest response');
            
            if ('undefined' !== (typeof xhrTimeout) && xhrTimeout) {
                try {
                    clearTimeout(xhrTimeout);
                } catch (exception) {} 
            }
            
            if (e && e.error && '' !== e.error && !_this.errorMessageSent && _this.sendErrors) {
            
                if ('Host is unresolved' == e.error.substr(0, 18)) {
                    // convert error message "Host is unresolved: notExistingDomain.org:80" to: "Host is unresolved"
                    
                    e.error = 'Host is unresolved';
                }
            
                // @todo translation keys for all error messages
                switch (e.error) {
                
                    case 'No connection':
                    
                        // apple requires that we inform the user if no network connection is available
                        _this.errorMessageSent = true;

                        var alertDialog = Titanium.UI.createAlertDialog({
                            title: _('Mobile_NetworkNotReachable'),
                            message: _('Mobile_YouAreOffline'),
                            buttonNames: [_('General_Ok')]
                        });

                        alertDialog.show();
                    
                        break;
                    
                    case 'Request aborted':
                    case 'Chunked stream ended unexpectedly':

                        _this.errorMessageSent = true;

                        var alertDialog = Titanium.UI.createAlertDialog({
                            title: _('General_Error'),
                            message: _('General_RequestTimedOut').replace('%s', _this.baseUrl),
                            buttonNames: [_('General_Ok')]
                        });

                        alertDialog.show();
                        
                        break;
                    
                    case 'Host is unresolved':
                    case 'Not Found':

                        _this.errorMessageSent = true;
                        
                        var alertDialog = Titanium.UI.createAlertDialog({
                            title: _('General_Error'),
                            message: _('General_NotValid').replace('%s', _this.baseUrl),
                            buttonNames: [_('General_Ok')]
                        });
                        
                        // @todo go directly to settings after user has confirmed the ok button?

                        alertDialog.show();
                        
                        break;
                    
                    case 'Missing base url':
                    
                        // ignore this error, user has not already set up the app
                        break;
                        
                    default: 
                        /**
                         * further known error codes: 
                         * 'Failed to parse response' -> we set this error if we were not able to parse the response
                         * 'Manager is shut down.'    -> don't know what this exactly means
                         * 'No wrapped connection'    -> don't know what this exactly means
                         * 'Adapter is detached'      -> don't know what this exactly means
                         */
                        _this.errorMessageSent = true;
                        
                        var alertDialog = Titanium.UI.createAlertDialog({
                            title: _('General_Error'),
                            message: _('General_ErrorRequest'),
                            buttonNames: [_('General_Ok')]
                        });

                        alertDialog.show();
                }
            }
            
            callback.apply(_this.context, []);
            
            callback = null;
            
            _this.verifyAllResultsReceived();
        };
        
        var successHandler = function () {
        
            Log.debug('Received response ' + this.responseText, 'HttpRequest');
            
            if ('undefined' !== (typeof xhrTimeout) && xhrTimeout) {
                try {
                    clearTimeout(xhrTimeout);
                } catch (e) {} 
            }

            try {
                var response;
            
                if ('json' === _this.handleAs) {
                
                    response = JSON.parse(this.responseText);
                    
                } else if ('text' === _this.handleAs) {
                    
                    response = this.responseText;
                    
                } else if ('xml' === _this.handleAs) {
                
                    response = this.responseXML;
                }
                
            } catch (exception) {
                
                errorHandler({error: 'Failed to parse response'});
                
                return;
            }
            
            var isValidResponse = _this.isValidResponse(response);
            
            if (isValidResponse) {
            
                _this.numReceivedCalls++;
                
                if (callback) {
                    try {
                        callback.apply(_this.context, [response, parameter]);
                    } catch (e) {
                        Log.warn('Failed to call callback method: ' + e.message, 'HttpRequest');
                    }
                }
                
                _this.verifyAllResultsReceived();
                
                callback = null;
                response = null;
                
            } else {
                
                errorHandler({error: 'Invalid response'});
            }
        };

        if (!this.baseUrl) {

            errorHandler({error: 'Missing base url'});
            
            return;
        }

        if (!Titanium.Network || !Titanium.Network.online) {
            
            errorHandler({error: 'No connection'});

            return;
        }

        var requestUrl  = '';
        
        if (parameter) {
            
            requestUrl += '?';
            
            for (var paramName in parameter) {
                requestUrl += paramName + '=' + parameter[paramName] + '&';
            }
        }
        
        requestUrl = this.baseUrl + requestUrl.encodeUrlParams();
        
        Log.debug('RequestUrl is ' + requestUrl, 'HttpRequest');
        
        var xhr     = Titanium.Network.createHTTPClient({validatesSecureCertificate: false});
        
        xhr.onload  = successHandler;
        xhr.onerror = errorHandler;
        
        // override the iPhone default timeout -> this timeout should never occur since we have implemented our own
        // timeout which is lower than this timeout.
        var timeoutValue = parseInt(Settings.getHttpTimeout(), 10);
        xhr.timeout      = timeoutValue + 20000;
        xhr.setTimeout(timeoutValue + 20000);

        function cancelXhr () {
            // cancel xhr only if request is not already done
            if (xhr.DONE !== xhr.readyState && xhr.LOADING !== xhr.readyState) {
                xhr.abort();
            }
        }
        
        // Titanium supports xhr.setTimeout() only for iPhone. Therefore, we create our own timeout.
        var xhrTimeout = setTimeout(cancelXhr, timeoutValue);

        xhr.open("GET", requestUrl);
        
        xhr.send({});
    };

    /**
     * Is called before the success callback method is called. If the response is not valid, the errorHandler will be
     * triggered which notifies the user about an error.
     * 
     * @param   {Object|null} The received response.
     * 
     * @returns {boolean} true if the response is valid, false otherwise.
     */
    this.isValidResponse = function (response) {
        
        return true;
    };

    /**
     * Verifies whether all results has been received by comparing the numer of received calls and the number of
     * registered calls. Fires the 'onAllResultsReceivedCallback' as soon as this case occurs.
     * 
     * @type null
     */
    this.verifyAllResultsReceived = function () {

        if (this.numReceivedCalls == this.registeredCalls.length) {

            if (this.onAllResultsReceivedCallback) {
                try {
                    this.onAllResultsReceivedCallback.apply(this.context, []);
                } catch (e) {
                    Log.debug('Failed to call allResultsReceivedCallback: ' + e.message, 'HttpRequest');
                }
            }
            
            // we have to remove each registered call from the stack. otherwise each already sent request will be fired
            // multiple times - on each sendRegisteredCalls()
            while (this.registeredCalls && this.registeredCalls.length) {
                this.registeredCalls.pop();
            }
            
            this.numReceivedCalls             = 0;
            this.onAllResultsReceivedCallback = null;
            this.registeredCalls              = [];
            this.errorMessageSent             = false;
            this.context                      = null;

        }
        
    };
};
