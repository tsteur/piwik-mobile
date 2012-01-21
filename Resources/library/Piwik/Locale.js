/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/** @private */
var Piwik = require('library/Piwik');

/**
 * @class    The top level Locale module. The module contains a few methods for querying device locale information.
 * 
 * @exports  Locale as Piwik.Locale
 * @static
 */
function Locale () {

    /**
     * Returns the chosen locale or the platform locale if not already one chosen.
     *
     * @returns  {string}  The locale, for example 'de' or 'en'.
     */
    this.getLocale = function () {

        var settings = Piwik.require('App/Settings');
        var locale   = settings.getLanguage();

        if (locale) {

            return locale;
        }

        locale = this.getPlatformLocale();
        locale = locale.toLowerCase();

        settings.setLanguage(locale);

        return locale;
    };

    /**
     * Queries the platform/device locale or a default value if the platform locale is not readable.
     *
     * @returns  {string}  The platform locale, for example 'en'.
     */
    this.getPlatformLocale = function () {

        if (Ti.Platform.locale) {

            var locale = Ti.Platform.locale;

            if (locale && locale.substr) {

                // some devices return for example "de-de". we just want the first two characters
                return locale.substr(0, 2).toLowerCase();
            }

            return locale;
        }

        return 'en';
    };
}

module.exports = new Locale();