/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class  Provides the ability to make an authenticated call using the piwik rest api. The data are requested
 *         via HTTP GET method. 
 * 
 * @augments HttpRequest
 */
function PiwikModel () {

    /**
     * Defines the format of the output when fetching data from the piwik rest api.
     * 
     * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Standardparameters">Piwik Api Reference</a>
     *
     * @default "json"
     * @type String
     *
     * @override
     */
    this.format             = 'json';

    /**
     * Defines the period you request the statistics for.
     * 
     * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Standardparameters">Piwik Api Reference</a>
     *
     * @default "day"
     * @type String
     */
    this.period             = 'day';
    
    /**
     * The needed token to make an authenticated call.
     * 
     * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Makeanauthenticatedcall">Piwik Api Reference</a>
     * @default "anonymous"
     * 
     * @type String|null
     */
    this.userAuthToken      = 'anonymous';
    
    /**
     * The handleAs parameter specifices how to parse the received data. 
     *
     * @see HttpRequest#handleAs
     * 
     * @default "text"
     *
     * @type string
     *
     * @override
     */
    this.handleAs = 'json';
    
    /**
     * Sets (overwrites) the user auth token.
     *
     * @param {string} token
     *
     * @type null
     */
    this.setUserAuthToken   = function (token) {

        // override default token only if token is a string and has at least 5 chacters.
        if (token && 'string' === (typeof token).toLowerCase() && 4 < token.length) {
            this.userAuthToken = token;
        } else {
            this.userAuthToken = 'anonymous';
        }

    };

    /**
     * Registers a call to send it simultaneously with other calls afterwards.
     * 
     * @param {string}     method     See {@link HttpRequest#send}
     * @param {Object}     account    See {@link AccountModel#getAccountById}
     * @param {Object}     parameter  See {@link HttpRequest#send}
     * @param {Function}   callback   See {@link HttpRequest#send}
     * 
     * @type null
     *
     * @override
     */
    this.registerCall = function (method, parameter, account, callback) {

        this.registeredCalls.push({method: method,
                                   parameter: parameter,
                                   account: account,
                                   callback: callback});
        
    };

    /**
     * Fires each previous registered calls nearly simultaneous.
     * 
     * @param {Function}    onAllResultsReceivedCallback   This callback method is called as soon as all results has
     *                                                     been received. The method will be executed in the previous
     *                                                     set context.
     * 
     * @type null
     *
     * @override
     */
    this.sendRegisteredCalls  = function (onAllResultsReceivedCallback) {
    
        this.numReceivedCalls = 0;
        
        this.onAllResultsReceivedCallback = onAllResultsReceivedCallback;
        
        var call = null;
        
        if (!this.registeredCalls || 0 === this.registeredCalls.length) {
        
            this.verifyAllResultsReceived();
            
        } else {
            
            for (var index = 0; index < this.registeredCalls.length; index++) {
                call = this.registeredCalls[index];

                this.send(call.method, call.parameter, call.account, call.callback);
            }
        }
    };
    
    /**
     * Mixins all required parameters to make an call to the piwik api. Sets default values for not set parameters and
     * adds some further parameters.
     *
     * @param {Object} parameter   The given parameters in this style: Object ( [key] => <value> )
     *
     * @private
     * @type null
     */
    this._mixinParameter = function (parameter) {

        if (!parameter.module) {
            parameter.module     = 'API';
        }

        if (!parameter.date) {
            // @todo add this value to config
            parameter.date       = 'today';
        }

        if (this.userAuthToken) {
            parameter.token_auth = this.userAuthToken;
        }

        if (!parameter.period) {
            parameter.period     = this.period;
        }

        if (!parameter.format) {
            parameter.format     = this.format;
        }
        
        if(Settings.getLanguage()) {
            parameter.language = Settings.getLanguage();
        }
        
        return parameter;
    };

    /**
     * Verifies the response.
     * @see HttpRequest#isValidResponse
     * 
     * @param   {Object|null} The received response.
     * 
     * @returns {boolean} true if the response is valid, false otherwise.
     *
     * @override
     */
    this.isValidResponse = function (response) {
        
        if (response && (response instanceof Object) && response.result && 'error' == response.result) {
            
            if (this.errorMessageSent || !this.sendErrors) {
                
                return false;
            }
            
            this.errorMessageSent = true;
            
            var message = _('General_InvalidResponse');
            
            if (response.message) {
                message = response.message;
            }

            var alertDialog = Titanium.UI.createAlertDialog({
                title: _('General_Error'),
                message: message,
                buttonNames: [_('General_Ok')]
            });

            alertDialog.show();
            
            return false;
        }
        
        return true;
    };
    
    /**
     * Sends a request to the piwik api.
     *
     * @param {string}   method      The method you want to call. See {@link http://dev.piwik.org/trac/wiki/API/Reference#Methods}
     * @param {Object}   account     See {@link AccountModel#getAccountById}
     * @param {Object}   parameter   The given parameters in this style: Object ( [key] => <value> )
     * @param {Function} callback    A callback function which is called upon a successful or error response. In case of
     *                               a error response the callback receives no arguments, otherwise the arguments are 
     *                               the received response and the used parameters to make the api call.
     *
     * @type null
     */
    this.send = function (method, parameter, account, callback) {

        if (!parameter) {
            parameter = {};
        }
        
        if (account && account.tokenAuth) {
            this.setUserAuthToken(account.tokenAuth);
        }
        
        if (account && account.accessUrl) {
            this.setBaseUrl(account.accessUrl);
        }

        parameter        = this._mixinParameter(parameter);
        parameter.method = method;
        
        this.handle(parameter, callback);
        
        return;
    };
}

/**
 * Extend the HttpRequest.
 */
PiwikModel.prototype = new HttpRequest();
