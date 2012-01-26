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
 * @class    Provides some translation related methods. The translations for each language are stored within the
 *           'Resources/i18n' folder. These files can be generated/updated via the python script
 *           'tools/updatelanguagefiles.py'.
 *
 * @see      <a href="http://dev.piwik.org/trac/wiki/API/Reference#LanguagesManager">Piwik Languages Manager</a>
 *
 * @exports  Translation as Piwik.Locale.Translation
 * @static
 */
function Translation () {

    /**
     * This event will be fired as soon as the user changes the language and the translations of the changed selected
     * language are loaded.
     *
     * @name     Piwik.Locale.Translation#event:onTranslationsLoaded
     * @event
     * @context  {Ti.App}
     *
     * @param    {Object}  event
     * @param    {string}  event.type  The name of the event.
     *
     * @todo     add an eventListener to this event and refresh each window as soon as one changes the 
     *           langauge/translations are loaded?
     */

    /**
     * The translations depending on the current active/selected locale.
     * 
     * @type  null|Object
     *
     * Object ( [translationKey] => [Translated value] )
     */
    this.translations = null;

    /**
     * Default translations are used if no language was chosen or if chosen language is not provided by
     * the piwik LanguageManager.
     *
     * @type Object
     *
     * Object ( [translationKey] => [default translation] )
     *
     * @constant
     */
    this.DEFAULT_TRANSLATION = require('i18n/default');

    /**
     * Available languages.
     * This list should be updated every time a new language is released to piwik. We could also automatically fetch a
     * list of all available languages via api before releasing a new version. But not each language is supported/works
     * on each platform. We have to test each new language before adding it.
     *
     * @type  Object
     *
     * Object ( [code] => [language name] )
     *
     * @constant
     */
    this.AVAILABLE_LANGUAGES = {
        be:         'Беларуская',
        bg:         'Български',
        ca:         'Català',
        cs:         'Česky',
        da:         'Dansk',
        de:         'Deutsch',
        el:         'Ελληνικά',
        en:         'English',
        es:         'Español',
        et:         'Eesti keel',
        eu:         'Euskara',
        fa:         '\u0641\u0627\u0631\u0633\u06cc',
        fi:         'Suomi',
        fr:         'Français',
        gl:         'Galego',
        hu:         'Magyar',
        id:         'Bahasa Indonesia',
        it:         'Italiano',
        is:         '\u00cdslenska',
        ja:         '日本語',
        ko:         '한국어',
        lt:         'Lietuvių',
        nb:         'Norsk (bokmål)',
        nl:         'Nederlands',
        nn:         'Nynorsk',
        pl:         'Polski',
        'pt-br':    'Português brasileiro',
        pt:         'Português',
        ro:         'Română',
        ru:         'Русский',
        sk:         'Slovensky',
        sq:         'Shqip',
        sr:         'Srpski',
        sv:         'Svenska',
        tr:         'Türkçe',
        uk:         'Українська',
        'zh-cn':    '简体中文',
        'zh-tw':    '台灣語'
    };

    // these languages are not supported / don't work on android
    if (Piwik.getPlatform().isIos) {
        this.AVAILABLE_LANGUAGES.ar = '\u0627\u0644\u0639\u0631\u0628\u064a\u0629';
        this.AVAILABLE_LANGUAGES.ka = '\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8';
        this.AVAILABLE_LANGUAGES.he = '\u05e2\u05d1\u05e8\u05d9\u05ea';
        this.AVAILABLE_LANGUAGES.te = '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41';
        this.AVAILABLE_LANGUAGES.th = 'ไทย';
    }

    /**
     * Returns the translation for the given key if one exists or the key itself if not.
     *
     * @param    {string}  key  key to translation
     *
     * @returns  {string}  Translated key. Uses the value defined in {@link Piwik.LocaleTranslation#translations} or 
     *                     the default translation if no translation exists for the given key. If even the default 
     *                     value does not exist it returns the key and logs an error. In such a case you have to 
     *                     define a default translation for the given key, 
     *                     see {@link Piwik.LocaleTranslation#DEFAULT_TRANSLATION}.
     */
    this.getString = function (key) {

        if (this.translations && this.translations[key]) {

            return this.translations[key];
        }

        if (this.DEFAULT_TRANSLATION[key]) {

            return this.DEFAULT_TRANSLATION[key];
        }

        Piwik.getLog().error('Missing default translation for key ' + key, 'Piwik.Locale.Translation::get');

        return key;
    };

    /**
     * Fetches all needed translations depending on the current locale.
     *
     * @fires  Piwik.Locale.Translation#event:onTranslationsLoaded
     */
    this.load = function () {

        var locale = Piwik.require('Locale');
        locale     = locale.getLocale();

        if (!this.AVAILABLE_LANGUAGES || !this.AVAILABLE_LANGUAGES[locale]) {
            // no valid locale
            return;
        }

        try {
            this.translations = require('i18n/' + locale);
        } catch (e) {
            Piwik.getLog().error('Failed to load translations for locale ' + locale, 'Piwik.Locale.Translation::load');

            var uiError = Piwik.getUI().createError({exception: e, errorCode: 'PiTrLo35'});
            uiError.showErrorMessageToUser();
        }

        Ti.App.fireEvent('onTranslationsLoaded', {type: 'onTranslationsLoaded'});
    };

    /**
     * Returns a map of all available/supported languages.
     *
     * @see      Piwik.Locale.Translation#AVAILABLE_LANGUAGES
     *
     * @returns  {Object}  All available languages
     */
    this.getAvailableLanguages = function () {

        return this.AVAILABLE_LANGUAGES;
    };
}

module.exports = new Translation();