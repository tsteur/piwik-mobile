/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * Builtin object.
 * @class
 * @name String
 */
 
/**#@+
 * Extension to builtin string.
 * @memberOf String
 * @method
 */

/**
 * Parses a string - which is in the following format '2010-05-12' - and converts it to a Date object. 
 * This format is used in piwik rest calls.
 *
 * @example
 * '2010-05-31'.toPiwikDate();
 *
 * @returns {Date}  The created date object.
 */
String.prototype.toPiwikDate = function () {

    if ('today' == this) {
    
        return new Date();
    };

    if ('yesterday' == this) {
        var now = new Date();
        
        now.setDate(now.getDate() - 1);
        
        return now;
    };

    var changedDate = this.split('-');
    
    var formatDate  = null;
    
    if (3 <= changedDate.length) {
        formatDate  = new Date(changedDate[0], changedDate[1] - 1, changedDate[2]);
    } else if (2 === changedDate.length) {
        formatDate  = new Date(changedDate[0], changedDate[1] - 1, 1);
    } else if (1 === changedDate.length) {
        formatDate  = new Date(changedDate[0], 0, 1);
    }

    return formatDate;
};

/**
 * Encodes url params. Use always this method instead of encodeUrI() cause this method will always work.
 * Uses Ti.Network.encodeURIComponent to encode the params. Currently it does not work correct if the string
 * contains the protocol + domain.
 *
 * @example
 * '?idSite=5&access[]=5'.encodeUrlParams();
 *
 * @returns {string}  The encoded url params
 */
String.prototype.encodeUrlParams = function () {

    var url        = this;
    var encodedURI = '';

    if ('?' == this.substring(0, 1)) {
        url        = url.substring(1);
        encodedURI = '?';
    }

    var paramArray = url.split("&");
    
    for (var index = 0; index < paramArray.length; index++) {
        var keyValue      = paramArray[index].split("=");
        
        if (keyValue[0]) {
            keyValue[0]   = Ti.Network.encodeURIComponent(keyValue[0]);
        }
        
        if (keyValue[1]) {
            keyValue[1]   = Ti.Network.encodeURIComponent(keyValue[1]);
        }
        
        paramArray[index] = keyValue.join("=");
    }
    
    encodedURI = encodedURI + paramArray.join("&");
    
    return encodedURI;
};

/**
 * Strip whitespace from the beginning and end of a string.
 *
 * @returns {string}  The trimmed string
 */
String.prototype.trim = function () {

    return this.replace (/^\s+/, '').replace (/\s+$/, '');
};

/**
 * We need an url like http://demo.piwik.org/ or http://demo.piwik.org/foo/bar/
 * Therefore we have to add a trailing / if it doesn't exist already or remove for example index.php if url is
 * http://demo.piwik.org/index.php
 *
 * @param   {string}   accessUrl    A piwik access url.
 *
 * @returns {string}   The formatted access url.
 */
String.prototype.formatAccessUrl = function () {
    var accessUrl = this;

    if (!accessUrl) {
        Piwik.Log.debug('missing Accessurl in formatAccessUrl', 'String::formatAccessUrl');

        return '';
    }

    if ('/' == accessUrl.substr(accessUrl.length - 1, 1)) {

        return accessUrl;
    }

    if ('.php' == accessUrl.substr(accessUrl.length -4, 4).toLowerCase()) {
        var lastSlash = accessUrl.lastIndexOf('/');
        accessUrl     = accessUrl.substr(0, lastSlash + 1);

        return accessUrl;
    }

    accessUrl = accessUrl + '/';

    return accessUrl;
};