/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Provides some useful translation related methods. Only english default translations are delivered in
 *          the applications by default. Once the user selects a language we request the piwik api to fetch the 
 *          needed translations depending on the selected locale.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#LanguagesManager">Piwik Languages Manager</a>
 *
 * @static
 */
var Translation = {};

/**
 * The translations are stored within the cache as soon as the user has chosen a language. Once a translation
 * is requested we automatically try to get the translations from cache.
 * 
 * @type null|Object
 * 
 * Object ( [translationKey] => [Translated value] )
 */
Translation.translations = null;

/**
 * Default translations are used if no language was chosen or if chosen language is not provided by 
 * the piwik LanguageManager. 
 * 
 * Attend:
 * Additionally, the keys are used to identify which translation keys are used within the application. 
 * If a key is not defined within this object, the translated value will not be stored in cache. We store only 
 * needed keys in cache to save storage, resources and loading time.
 * 
 * @type {Object}
 * 
 * Object ( [translationKey] => [default translation] )
 *
 * @constant
 */
Translation.DEFAULT_TRANSLATION = {
    
    Actions_Actions:                                                    'Actions',
    Actions_ColumnPageURL:                                              'Page URL',
    Actions_ColumnPageName:                                             'Page Name',
    Actions_ColumnClickedURL:                                           'Clicked URL',
    Actions_ColumnDownloadURL:                                          'Download URL',
    Actions_SubmenuPages:                                               'Pages',
    Actions_SubmenuPageTitles:                                          'Page titles',
    Actions_SubmenuOutlinks:                                            'Outlinks',
    Actions_SubmenuDownloads:                                           'Downloads',
    CoreHome_PeriodDay:                                                 'Day',
    CoreHome_PeriodWeek:                                                'Week',
    CoreHome_PeriodMonth:                                               'Month',
    CoreHome_PeriodYear:                                                'Year',
    CoreHome_PeriodDays:                                                'days',
    CoreHome_PeriodWeeks:                                               'weeks',
    CoreHome_PeriodMonths:                                              'months',
    CoreHome_PeriodYears:                                               'years',
    CoreHome_TableNoData:                                               'No data for this table.',
    CoreUpdater_UpdateTitle:                                            'Update',
    General_Error:                                                      'Error',
    General_Done:                                                       'Done',
    General_Ok:                                                         'Ok',
    General_Settings:                                                   'Settings',
    General_Save:                                                       'Save',
    General_Visitors:                                                   'Visitors',
    General_ExceptionPrivilegeAtLeastOneWebsite:                        "You can't access this resource as it requires an %s access for at least one website.",
    General_ColumnNbVisits:                                             'Visits',
    General_ColumnNbUniqVisitors:                                       'Unique visitors',
    General_ColumnNbActions:                                            'Actions',
    General_ColumnMaxActions:                                           'Maximum Actions in one visit',
    General_ColumnBounces:                                              'Bounces',
    General_ColumnVisitsWithConversions:                                'Visits with conversions',
    General_ColumnSumVisitLength:                                       'Total time spent by visitors (in seconds)',
    General_ErrorRequest:                                               'Oops... problem during the request, please try again.',
    General_ForExampleShort:                                            'eg.',
    General_LongMonth_1:                                                'January',
    General_LongMonth_2:                                                'February',
    General_LongMonth_3:                                                'March',
    General_LongMonth_4:                                                'April',
    General_LongMonth_5:                                                'May',
    General_LongMonth_6:                                                'June',
    General_LongMonth_7:                                                'July',
    General_LongMonth_8:                                                'August',
    General_LongMonth_9:                                                'September',
    General_LongMonth_10:                                               'October',
    General_LongMonth_11:                                               'November',
    General_LongMonth_12:                                               'December',
    General_NoDataForGraph:                                             'No data for this graph.',
    General_NotValid:                                                   '%s is not valid',
    General_Others:                                                     'Others',
    General_PiwikXIsAvailablePleaseNotifyPiwikAdmin:                    '%s is available. Please notify the site administrator.',
    General_Required:                                                   '%s required',
    General_Unknown:                                                    'Unknown',
    General_YourChangesHaveBeenSaved:                                   'Your changes have been saved.',
    Login_Login:                                                        'Username',
    Login_Password:                                                     'Password',
    Referers_ColumnKeyword:                                             'Keyword',
    Referers_ColumnRefererType:                                         'Referer Type',
    Referers_ColumnSearchEngine:                                        'Search Engine',
    Referers_ColumnWebsite:                                             'Website',
    Referers_Referers:                                                  'Referers',
    Referers_SearchEngines:                                             'Search Engines',
    Referers_Keywords:                                                  'Keywords',
    Referers_Websites:                                                  'Websites',
    SitesManager_Cancel_js:                                             'Cancel',
    SitesManager_ExceptionInvalidUrl:                                   "The url '%s' is not a valid URL.",
    UsersManager_PrivView:                                              'View',
    UserSettings_SubmenuSettings:                                       'Settings',
    UserSettings_Browsers:                                              'Browsers',
    UserSettings_OperatingSystems:                                      'Operating systems',
    UserSettings_ColumnOperatingSystem:                                 'Operating system',
    UserSettings_ColumnResolution:                                      'Resolution',
    UserSettings_ColumnTypeOfScreen:                                    'Type of screen',
    UserSettings_BrowserFamilies:                                       'Browser families',
    UserSettings_Resolutions:                                           'Resolutions',
    UserSettings_WideScreen:                                            'Wide Screen',
    VisitFrequency_ColumnReturningVisits:                               'Returning Visits',
    VisitFrequency_ColumnActionsByReturningVisits:                      'Actions by Returning Visits',
    VisitFrequency_ColumnMaximumActionsByAReturningVisit:               'Maximum Actions by a Returning Visit',
    VisitFrequency_ColumnTotalTimeSpentByReturningVisits:               'Total time spent by Returning Visits (in seconds)',
    VisitsSummary_EvolutionOverLastPeriods:                             'Evolution over the last %s',
    VisitsSummary_SubmenuOverview:                                      'Overview',
    
    // New Strings
    General_InvalidResponse:                                            'The received data is invalid.',
    General_ChooseLanguage:                                             'Choose language',
    General_ChoosePeriod:                                               'Choose period',
    General_ChooseWebsite:                                              'Choose website',
    General_Language:                                                   'Language',
    General_PleaseUpdatePiwik:                                          'Please update your Piwik',
    General_RequestTimedOut:                                            'A data request to %s timed out. Please try again.',
    Mobile_Anonymous_Access:                                            'Anonymous access',
    Mobile_AccessUrlLabel:                                              'Piwik Access Url',
    Mobile_EnableGraphsLabel:                                           'Display graphs',
    Mobile_MultiChartLabel:                                             'Display sparklines',
    Mobile_MultiChartInfo:                                              'next to each website on the welcome screen',
    Mobile_NetworkNotReachable:                                         'Network not reachable',
    Mobile_SaveSuccessError:                                            'Please verify settings',
    Mobile_YouAreOffline:                                               'Sorry, you are currently offline'
};

/**
 * Available languages.
 * This list should be updated every time a new language is released to piwik.
 * 
 * @type {Object}
 * 
 * Object ( [code] => [language name] )
 *
 * @constant
 */
Translation.AVAILABLE_LANGUAGES = {
    am:         'አማርኛ',
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
    fi:         'Suomi',
    fr:         'Français',
    gl:         'Galego',
    hu:         'Magyar',
    it:         'Italiano',
    ja:         '日本語',
    ko:         '한국어',
    lt:         'Lietuvių',
    nb:         'Norsk (bokmål)',
    nl:         'Nederlands',
    pl:         'Polski',
    'pt-br':    'Português brasileiro',
    pt:         'Português',
    ro:         'Română',
    ru:         'Русский',
    sk:         'Slovensky',
    sq:         'Shqip',
    sr:         'Srpski',
    sv:         'Svenska',
    th:         'ไทย',
    uk:         'Українська',
    'zh-cn':    '简体中文',
    'zh-tw':    '台灣語'
};

/**
 * Returns the translation for the given key if one exists or the key itself if not.
 * 
 * @param   {string}    key   key to translation
 *
 * @returns {string}    Translated key. Uses the value defined in {@link Translation.translations} or the default
 *                      translation if no translation exists for the given key. If even the default value does not exist
 *                      it returns the key and logs an error. In such a case you have to define a default translation
 *                      for the given key, see {@link Translation.DEFAULT_TRANSLATION}.
 */
Translation.get = function (key) {
    
    // verify translation is loaded each time
    if(!Translation.translations && Settings.getLanguage()) {
        Translation.translations = Cache.get('translations_'+Settings.getLanguage());
    }
    
    if (Translation.translations && Translation.translations[key]) {
        
        return Translation.translations[key];
    }
    
    if (Translation.DEFAULT_TRANSLATION[key]) {
        
        return Translation.DEFAULT_TRANSLATION[key];
    }
    
    Log.error('Missing default translation for key ' + key, 'Translation');
    
    return key;
};

/**
 * Returns the translation for the given period.
 * 
 * @param   {string}    period    The identifier of the period you want to translated. For example 'day' or 'week'.
 * @param   {boolean}   plural    Identifies if the given period should be returned as plural.
 * 
 * @returns {string}    The translated period.
 */
Translation.getPeriod = function (period, plural) {

    if(plural) {
    
        switch (period) {
            case 'day':
                return _('CoreHome_PeriodDays');
            case 'week':
                return _('CoreHome_PeriodWeeks');
            case 'month':
                return _('CoreHome_PeriodMonths');
            case 'year':
                return _('CoreHome_PeriodYears');
        }
        
    } else {
    
        switch (period) {
            case 'day':
                return _('CoreHome_PeriodDay');
            case 'week':
                return _('CoreHome_PeriodWeek');
            case 'month':
                return _('CoreHome_PeriodMonth');
            case 'year':
                return _('CoreHome_PeriodYear');
        }
        
    }
    
};

/**
 * Fetches all needed translations depending on the chosen locale or - if not already chosen - on the 
 * device locale. Fetches the translations only if languages are not already cached.
 *
 * @type null
 *
 * @todo implement a getMobileTranslations in LanguageManager that only returns required values? and load only 
 *       strings that are required for mobile version. saves us a lot of data transfer.
 */
Translation.fetchTranslations = function () {

    if (Translation.areCached()) {
        
        return;
    }
    
    var locale     = Translation.getLocale();
    
    var parameters = {module:       'API',
                      method:       'LanguagesManager.getTranslationsForLanguage',
                      format:       'json',
                      token_auth:   Settings.getPiwikUserAuthToken(),
                      languageCode: locale};
    
    var request    = new HttpRequest();
    
    request.setBaseUrl(Settings.getPiwikUrl());
    request.handleAs = 'json';
    
    request.handle(parameters, function (response, parameter) {
        
        Translation.saveTranslation(response, parameters.languageCode);
        
        Titanium.App.fireEvent('translationsLoaded', {});
        
    });
};

/**
 * Checks whether translations of a chosen language are already cached.
 * 
 * @see Settings.getLanguage
 *
 * @returns {boolean} true if the translations are already cached, false otherwise.
 */
Translation.areCached = function () {
    var language             = Translation.getLocale();
    
    Translation.translations = Cache.get('translations_' + language);
    
    if (Translation.translations == Cache.KEY_NOT_FOUND) {
        
        return false;
    }
    
    return true;
};

/**
 * Arranges the storage of all needed translations in cache for a later usage (beyond application sessions). Stores
 * only needed translations/keys which are defined in {@link Translation#DEFAULT_TRANSLATION}
 *
 * @param    {Array}    An array containing multiple translations in the following format:
 *                      Array (
 *                          [int] => Object (
 *                                     [label] => [The translation key]
 *                                     [value] => [The value of the translated key]
 *                          )
 *                      )
 * @param   {string}    locale          The locale which the translations belong to.
 *
 * @type null
 */
Translation.saveTranslation = function (translations, locale) {
    
    translations             = Translation.filterTranslations(translations);
    
    Translation.translations = translations;
    
    if (locale) {
        Cache.set('translations_' + locale, translations, null);
    }
    
    translations = null;
};

/**
 * Removes unneeded keys from translations. 
 * 
 * @param    {Array}    An array containing multiple translations in the following format:
 *                      Array (
 *                          [int] => Object (
 *                                     [label] => [The translation key]
 *                                     [value] => [The value of the translated key]
 *                          )
 *                      )
 *                      Considers a label as a needed translation only if there is a property in
 *                      {@link Translation#DEFAULT_TRANSLATION} having the same value.
 *
 * @returns  {Object}   An object containing only the needed translations, see {@link Translation#translations}.
 */
Translation.filterTranslations = function (translations) {

    if (!translations || !(translations instanceof Array) || !translations.length) {
    
        return {};
    }

    var neededTranslations = {};
    
    var key;
    
    for(var index = 0; index < translations.length; index++) {
        key = translations[index].label;
    
        if(Translation.DEFAULT_TRANSLATION[key]) {
            neededTranslations[key] = translations[index].value;
        }
    }
    
    translations = null;
    
    return neededTranslations;
};

/**
 * Returns a map of available languages.
 * 
 * @see Translation#AVAILABLE_LANGUAGES
 * 
 * @returns {Object} All available languages
 */
Translation.getAvailableLanguages = function () {

    return Translation.AVAILABLE_LANGUAGES;
};

/**
 * Returns the chosen locale or the platform locale if not already one chosen.
 * 
 * @returns  {string}  The platform locale.
 */
Translation.getLocale = function () {

    var locale = Settings.getLanguage();
    
    if(locale) {
        
        return locale;
    }
    
    return Translation.getPlatformLocale();
};

/**
 * Queries the platform/device locale or a default value if the platform locale is not readable.
 * 
 * @returns  {string}  The platform locale.
 */
Translation.getPlatformLocale = function () {
    
    if (Titanium.Platform.locale) {
        
        return Titanium.Platform.locale;
    }
    
    return 'en';
};

/**
 * Translation wrapper. You have to use this method if you want to translate any text within the application.
 *
 * @see Translation#get
 * 
 * @param   {string}  key   
 
 * @returns {string}  The translated key.
 */
function _(key) {

    return Translation.get(key);
}

