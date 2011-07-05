/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   Can be used to send a GET http request to any url. Attend that synchronous requests are not supported at the
 *          moment.
 *
 * @example
 * var request = Piwik.require('Network/HttpRequest');
 * request.setBaseUrl('http://demo.piwik.org/');
 * request.setParameter({siteId: 5});
 * request.setCallback(anyContext, function (response, parameters) {});
 * request.handle();
 */
Piwik.Network.HttpRequest = function () {
    
    /**
     * Holds the base url.
     * 
     * @type String
     *
     * @see Piwik.Network.HttpRequest#setBaseUrl
     * 
     * @private
     */
    this.baseUrl          = null;
    
    /**
     * A given callback method will be executed in this context. This means you can access the properties of the context
     * object within the callback using 'this'. 
     *
     * @see Piwik.Network.HttpRequest#setCallback
     * 
     * @type Object
     */
    this.context          = null;

    /**
     * We have to inform the user if no network connection is available. Apple requires this. Additionally, we want to
     * inform the user if the request timed out or the url does not exist. This property is set to true as soon as an
     * error message was sent to the user. We do not want to inform the user more than once if an error occurs.
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
    this.sendErrors       = true;
    
    /**
     * The handleAs parameter specifices how to parse the received data before the callback method is called.
     * Supported values are 'json', 'xml' and 'text'.
     * 
     * @default "text"
     *
     * @type string
     */
    this.handleAs         = 'text';

    /**
     * An object containing key/value pairs. These are used as GET parameters when executing the request.
     *
     * @see Piwik.Network.HttpRequest#setParameters
     *
     * @type Object|null
     */
    this.parameter        = null;

    /**
     * The callback method will be executed as soon as the readyState is finished. The callback method will be executed
     * in context of {@link Piwik.Network.HttpRequest#context}. The callback method will be executed on a valid result
     * and on any error. If an error occurred, it does not pass the result to the callback method.
     *
     * @see Piwik.Network.HttpRequest#setCallback
     *
     * @type Function|null
     */
    this.callback         = null;

    /**
     * An instance of the Titanium HTTP Client instance we have used to send the request. Is only set if the request is
     * currently in progress.
     *
     * @type Titanium.Network.HTTPClient
     */
    this.xhr              = null;

    /**
     * Sets (overwrites) the base url.
     * 
     * @param {string} baseUrl   An url without any GET parameter/Query. For example: 'http://domain.tld/dir/ectory'.
     *                           Do not include GET parameter like this 'http://domain.tld/dir/ectory?' or 
     *                           'http://domain.tld/dir/ectory?key=1&key2=2'. Use {@link Piwk.Network.HttpRequest#setParameter}
     *                           instead.
     * 
     * @type null
     */
    this.setBaseUrl  = function (baseUrl) {
    
        if (baseUrl && 'string' === (typeof baseUrl).toLowerCase() && 4 < baseUrl.length) {
            this.baseUrl = baseUrl;
        }
    };

    /**
     * Sets (overwrites) the GET parameters.
     *
     * @param {Object} parameter  An object containing key/value pairs, see {@link Piwik.Network.HttpRequest#parameter}
     *
     * @type null
     */
    this.setParameter  = function (parameter) {
        this.parameter = parameter;
    };

    /**
     * Sets (overwrites) the callback method and the context. The context object defines in which context the callback
     * method will be executed.
     *
     * @param   {Object}     context        A given callback method will be executed in this context. This means you
     *                                      can access the properties of the context object within the callback
     *                                      using 'this'. See {@link Piwik.Network.HttpRequest#context}
     * @param   {Function}   [callback]     Optional. The callback is called as soon as the response is received.
     *                                      The callback is called even on any error. Possible errors are:
     *                                      Network is not available, no base url is given, timeout, ...
     *                                      In such a case the callback method does not receive the response as an
     *                                      argument. Ensure that your callback method is able to handle such a case.
     *                                      The first argument the method does receive is the response, the second is
     *                                      the used parameters.
     *                                      See {@link Piwik.Network.HttpRequest#callback}
     */
    this.setCallback  = function (context, callback) {
        this.context  = context;
        this.callback = callback;
    };

    /**
     * Fires a single http request. Fires a callback method as soon as the response is received. Make sure to set
     * all data needed to handle the request before calling this method.
     */
    this.handle = function () {

        var parameter    = this.parameter;

        if (!parameter) {
            parameter    = {};
        }
        
        if (!this.context) {
            this.context = {};
        }

        if (!this.baseUrl) {

            this.error({error: 'Missing base url'});
            
            return;
        }

        if (!Ti.Network || !Ti.Network.online) {
            
            this.error({error: 'No connection'});

            return;
        }

        var requestUrl  = '';
        
        if (parameter) {
            
            requestUrl += '?';
            
            for (var paramName in parameter) {
                requestUrl += paramName + '=' + parameter[paramName] + '&';
            }
        }
        
        requestUrl   = this.baseUrl + requestUrl.encodeUrlParams();
        
        Piwik.Log.debug('RequestUrl is ' + requestUrl, 'Piwik.Network.HttpRequest::handle');
        
        this.xhr      = Ti.Network.createHTTPClient({validatesSecureCertificate: false, enableKeepAlive: false});
        var that      = this;
        
        this.xhr.onload   = function () { that.load(this); };
        this.xhr.onerror  = function () { that.error(); };

        var settings = Piwik.require('App/Settings');
        
        // override the iPhone default timeout -> this timeout should never occur since we have implemented our own
        // timeout which is lower than this timeout.
        var timeoutValue = parseInt(settings.getHttpTimeout(), 10);
        this.xhr.timeout      = timeoutValue;
        this.xhr.setTimeout(timeoutValue);

        this.xhr.open("GET", requestUrl);
        
        this.xhr.send({});
    };

    /**
     * Abort a pending request. Does not send any error to the user about this report. Does not call any callback
     * method.
     *
     * @returns   {boolean}   True if there was a pending request which we have aborted. False otherwise.
     */
    this.abort = function () {

        if (this.xhr && this.xhr.abort) {

            // make sure not to notify the user about this abort
            this.sendErrors = false;
            
            // make sure no callback method will be called.
            this.setCallback({}, function () {});
            
            this.xhr.abort();

            return true;
        }

        return false;
    };

    /**
     * This method will be executed as soon as the response is received. Parses the response, validates it and calls
     * the callback method on success.
     *
     * @param   {Titanium.Network.HTTPClient}   xhr    The used xhr request which contains the received response.
     */
    this.load = function (xhr) {

        Piwik.Log.debug('Received response ' + xhr.responseText, 'Piwik.Network.HttpRequest::load');

        try {
            // parse response
            var response;

            if ('json' === this.handleAs) {

                response = JSON.parse(xhr.responseText);

            } else if ('text' === this.handleAs) {

                response = xhr.responseText;

            } else if ('xml' === this.handleAs) {

                response = xhr.responseXML;
            }

        } catch (exception) {

            Piwik.UI.createError({exception: exception, errorCode: 'PiHrLo26'});

            this.error({error: 'Failed to parse response'});

            return;
        }

        // validate response
        var isValidResponse = this.isValidResponse(response);

        if (!isValidResponse) {

            this.error({error: 'Invalid response'});

            return;
        }

        var callback  = this.callback;
        if (!callback) {
            callback  = function () {};
        }

        var parameter = this.parameter;

        try {
            // execute callback in defined context
            callback.apply(this.context, [response, parameter]);
        } catch (e) {
            Piwik.Log.warn('Failed to call callback method: ' + e.message, 'Piwik.Network.HttpRequest::load#callback');

            var uiError = Piwik.UI.createError({exception: e, errorCode: 'PiHrLo29'});
            uiError.showErrorMessageToUser();
        }

        // onload hook
        if (this.onload) {
            this.onload();
        }

        this.xhr = null;
        callback = null;
        response = null;
    };

    /**
     * This method will be executed on any error. Displays a notification about the occurred error, if sendErrors is
     * enabled and if no error message was already sent. Executes the previous defined callback method afterwards.
     *
     * @param   {Object}    e    An Error Object that contains at least a property named error.
     */
    this.error = function (e) {

        Piwik.Log.warn(e, 'Piwik.Network.HttpRequest::error');

        if (e && e.error && '' !== e.error && this.displayErrorAllowed()) {

            if ('Host is unresolved' == e.error.substr(0, 18)) {
                // convert error message "Host is unresolved: notExistingDomain.org:80" to: "Host is unresolved"

                e.error = 'Host is unresolved';
            }

            // @todo translation keys for all error messages
            switch (e.error) {

                case 'No connection':

                    // apple requires that we inform the user if no network connection is available
                    this.errorMessageSent = true;

                    var alertDialog = Ti.UI.createAlertDialog({
                        title: _('Mobile_NetworkNotReachable'),
                        message: _('Mobile_YouAreOffline'),
                        buttonNames: [_('General_Ok')]
                    });

                    alertDialog.show();

                    break;

                case 'Request aborted':
                case 'Chunked stream ended unexpectedly':

                    this.errorMessageSent = true;

                    var alertDialog = Ti.UI.createAlertDialog({
                        title: _('General_Error'),
                        message: String.format(_('General_RequestTimedOut'), '' + this.baseUrl),
                        buttonNames: [_('General_Ok')]
                    });

                    alertDialog.show();

                    break;

                case 'Host is unresolved':
                case 'Not Found':

                    this.errorMessageSent = true;

                    var alertDialog = Ti.UI.createAlertDialog({
                        title: _('General_Error'),
                        message: String.format(_('General_NotValid'), '' + this.baseUrl),
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
                    if (!e.error) {
                        e.error = 'Unknown';
                    }

                    Piwik.UI.createError({exception: e, type: e.error,
                                          file: 'Piwik/Network/HttpRequest.js', errorCode: 'PiHrLe39'});
                        
                    this.errorMessageSent = true;

                    var alertDialog = Ti.UI.createAlertDialog({
                        title: _('General_Error'),
                        message: _('General_ErrorRequest') + ' Error Code: ' + e.error,
                        buttonNames: [_('General_Ok')]
                    });

                    alertDialog.show();
            }
        }

        var callback  = this.callback;
        if (!callback) {
            callback  = function () {};
        }

        callback.apply(this.context, []);

        this.xhr      = null;
        callback      = null;

        // onload hook
        if (this.onload) {
            this.onload();
        }
    };

    /**
     * Detects whether it is ok to display an error message. 
     *
     * @returns {boolean} true if we are allowed to display an error message, false otherwise.
     */
    this.displayErrorAllowed = function () {
        if (!this.sendErrors) {
            // displaying errors are not allowed for this request

            return false;
        }

        if (this.errorMessageSent) {
            // an error message was already displayed. Do not display an error again.

            return false;
        }

        if (this.onDisplayErrorAllowed) {

            return this.onDisplayErrorAllowed();
        }

        return true;
    };

    /**
     * The onload method will be called as soon as the load or error event was executed. 
     */
    this.onload = function () {
        // overwrite me
    };

    /**
     * Is called to validate the response before the success callback method will be called. If the response is not
     * valid, the errorHandler will be triggered which notifies the user about an error.
     * 
     * @param   {Object|null} The received response.
     * 
     * @returns {boolean} true if the response is valid, false otherwise.
     */
    this.isValidResponse = function (response) {
        
        return true;
    };
};