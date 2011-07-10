/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Tracker
 *
 * @static
 */
Piwik.Tracker = new function () {

    this.siteId        = config.tracking.siteId;
    this.apiVersion    = config.tracking.apiVersion;

    this.documentTitle = '';
    this.currentUrl    = '';

    var visitCount     = 0;
    var uuid           = null;
    var baseUrl        = config.tracking.baseUrl;

    var numAccounts    = Piwik.require('App/Accounts').getNumAccounts();

    var parameter      = {};

    this.init = function () {

        visitCount = this._getVisitCount();
        uuid       = this._getUniqueId();
    };

    this._getUniqueId = function () {

        if (uuid) {

            return uuid;
        }

        // have a look whether there is an already created uuid
        var cache      = Piwik.require('App/Cache');
        var cachedUUid = cache.get('tracking_visitor_uuid');

        if (cachedUUid && cache.KEY_NOT_FOUND !== cachedUUid) {

            uuid  = cachedUUid;

            return uuid;
        }

        return this._generateUniqueId();
    };

    this._generateUniqueId = function () {

        var now   = new Date();
        var nowTs = Math.round(now.getTime() / 1000);

        // generate uuid for this visitor
        uuid      = '';

        uuid      = Ti.Platform.osname + Ti.Platform.id + nowTs + Ti.Platform.model;
        uuid      = Ti.Utils.md5HexDigest(uuid).slice(0, 16);

        var cache = Piwik.require('App/Cache');
        cache.set('tracking_visitor_uuid', uuid);

        return uuid;
    };

    this._getVisitCount = function () {

        if (visitCount) {

            return visitCount;
        }

        // have a look whether there is already a visitcount number
        var cache            = Piwik.require('App/Cache');
        var cachedVisitCount = cache.get('tracking_visit_count');

        if (cachedVisitCount && cache.KEY_NOT_FOUND !== cachedVisitCount) {

            visitCount = cachedVisitCount;

            visitCount++;
        }

        // first visit
        if (!visitCount) {

            visitCount = 1;
        }

        cache.set('tracking_visit_count', visitCount);

        return visitCount;
    };

    this.trackPageView = function () {

        parameter.action_name = '' + this.documentTitle;
        parameter.url         = this.currentUrl;

        this.track();
    };

    this.trackEvent = function (event) {
        
        parameter.action_name = '' + event.title;
        parameter.url         = baseUrl + '/event' + event.url;

        this.track();
    };

    this.trackGoal = function (goalId) {

        parameter.idgoal = '' + goalId;
        parameter.url    = this.currentUrl;

        this.track();
    };

    this.trackException = function (exception) {

        if (!exception) {
            
            return;
        }

        exception.file    = '' + exception.file;
        exception.message = '' + exception.message;

        if (exception && exception.file && exception.file.length > 60) {
            // use max 60 chars
            exception.file = exception.file.substr(exception.file.length - 60);
        }

        if (exception && exception.message && exception.message.length > 200) {
            // use max 200 chars
            exception.message = exception.message.substr(0, 200);
        }

        var url   = '/exception/' + exception.type;
        url      += '/' + exception.errorCode;
        url      += '/' + exception.file;
        url      += '/' + exception.line;
        url      += '/' + exception.message;

        var title = 'Exception ' + exception.type;

        parameter.action_name = '' + title;
        parameter.url         = baseUrl + url;

        this.track();
    };

    this.trackLink = function (sourceUrl, linkType) {

        parameter           = {url: this.currentUrl};
        parameter[linkType] = sourceUrl;

        this.track(parameter);
    };

    this.setDocumentTitle = function (title) {
        this.documentTitle = '' + title;

        return this;
    };

    this.setCurrentUrl = function (url) {
        this.currentUrl = baseUrl + url;

        return this;
    };

    this.setCustomVariable = function (index, name, value, scope) {

        var key = 'cvar'
        if (scope && 'page' == scope) {
            key = 'cvar';
        } else if (scope && 'visit' == scope) {
            key = '_cvar';
        }

        if (!parameter[key]) {
            parameter[key] = {};
        }

        parameter[key]['' + index] = ['' + name, '' + value];
    };

    this.isEnabled = function () {

        var settings = Piwik.require('App/Settings');

        return settings.isTrackingEnabled();
    };

    this.track = function () {

        if (!config.tracking.enabled) {

            return;
        }

        if (!this.isEnabled()) {

            return;
        }
        
        this._mixinDefaultParameter();

        var tracker = Piwik.require('Network/TrackerRequest');
        
        tracker.setParameter(parameter);
        tracker.send();

        parameter = {};
    };

    this._mixinDefaultParameter = function () {

        if (!parameter) {
            parameter = {};
        }
        
        var now = new Date();

        // session based parameters
        parameter.idsite = this.siteId;
        parameter.rand   = String(Math.random()).slice(2,8);
        parameter.h      = now.getHours();
        parameter.m      = now.getMinutes();
        parameter.s      = now.getSeconds();

        // 1 = record request, 0 = do not record request
        parameter.rec    = 1;
        parameter.apiv   = this.apiVersion;
        parameter.cookie = '';

        parameter.urlref = 'http://' + Ti.Platform.osname + '.mobileapp.piwik.org';

        // visitor based
        parameter._id    = uuid;

        // visit count
        parameter._idvc  = visitCount;

        var caps         = Ti.Platform.displayCaps;
        parameter.res    = caps.platformWidth + 'x' + caps.platformHeight;

        this.setCustomVariable(1, 'OS', Ti.Platform.osname + ' ' + Ti.Platform.version, 'visit');

        // Piwik Version
        this.setCustomVariable(2, 'Piwik Mobile Version', Ti.App.version, 'visit');

        // Locale of the device + configured locale
        this.setCustomVariable(3, 'Locale', Ti.Platform.locale + '::' + Piwik.Locale.getLocale(), 'visit');

        this.setCustomVariable(4, 'Num Accounts', numAccounts, 'visit');

        if (parameter._cvar) {
            parameter._cvar = JSON.stringify(parameter._cvar);
        }

        if (parameter.cvar) {
            parameter.cvar = JSON.stringify(parameter.cvar);
        }
    };

    this.askForPermission = function () {

        if (!config.tracking.enabled) {

            return;
        }

        // uuid does not exist, this means user starts the app the first time.
        // ask user whether he wants to enable or disable tracking
        var alertDialog = Titanium.UI.createAlertDialog({
            title: 'Help us to improve Piwik Mobile',
            message: 'Do you like to enable anonymous usage tracking in Piwik Mobile? You can also disable/enable tracking in Settings.',
            buttonNames: [_('General_No'), _('General_Yes')]
        });

        alertDialog.addEventListener('click', function (event) {

            if (!event) {

                return;
            }

            var settings  = Piwik.require('App/Settings');

            switch (event.index) {
                case 1:

                    settings.setTrackingEnabled(true);

                    alert(_('Feedback_ThankYou'));
                    break;

                case 0:
                default:

                    settings.setTrackingEnabled(false);
                    break;
            }
        });

        alertDialog.show();
    };

    this.init();
};