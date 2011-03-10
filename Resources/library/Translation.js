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
    
    CorePluginsAdmin_Activate:                                          'Activate',
    CorePluginsAdmin_Deactivate:                                        'Deactivate',
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
    Feedback_DoYouHaveBugReportOrFeatureRequest:                        'Do you have a bug to report or a feature request?',
    General_AboutPiwikX:                                                'About Piwik %s',
    General_Error:                                                      'Error',
    General_Done:                                                       'Done',
    General_Ok:                                                         'Ok',
    General_Settings:                                                   'Settings',
    General_Save:                                                       'Save',
    General_ExceptionPrivilegeAtLeastOneWebsite:                        "You can't access this resource as it requires an %s access for at least one website.",
    General_Close:                                                      'Close',
    General_CurrentWeek:                                                'Current Week',
    General_CurrentMonth:                                               'Current Month',
    General_CurrentYear:                                                'Current Year',
    General_Delete:                                                     'Delete',
    General_Edit:                                                       'Edit',
    General_ErrorRequest:                                               'Oops... problem during the request, please try again.',
    General_ForExampleShort:                                            'eg.',
    General_GiveUsYourFeedback:                                         'Give us Feedback!',
    General_LoadingData:                                                'Loading data...',
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
    General_Today:                                                      'Today',
    General_Unknown:                                                    'Unknown',
    General_Value:                                                      'Value',
    General_Yesterday:                                                  'Yesterday',
    General_YourChangesHaveBeenSaved:                                   'Your changes have been saved.',
    Login_Login:                                                        'Username',
    Login_Password:                                                     'Password',
    SitesManager_Cancel_js:                                             'Cancel',
    SitesManager_ExceptionInvalidUrl:                                   "The url '%s' is not a valid URL.",
    UsersManager_ManageAccess:                                          'Manage access',
    UsersManager_PrivView:                                              'View',
    VisitsSummary_EvolutionOverLastPeriods:                             'Evolution over the last %s',
    
    // New Strings
    General_InvalidResponse:                                            'The received data is invalid.',
    General_ChooseLanguage:                                             'Choose language',
    General_ChoosePeriod:                                               'Choose period',
    General_ChooseWebsite:                                              'Choose website',
    General_ChooseDate:                                                 'Choose date',
    General_Language:                                                   'Language',
    General_PleaseUpdatePiwik:                                          'Please update your Piwik',
    General_RequestTimedOut:                                            'A data request to %s timed out. Please try again.',
    Mobile_AddAccount:                                                  'Add account',
    Mobile_Advanced:                                                    'Advanced',
    Mobile_AnonymousAccess:                                             'Anonymous access',
    Mobile_AccessUrlLabel:                                              'Piwik Access Url',
    Mobile_ChooseHttpTimeout:                                           'Choose HTTP timeout value',
    Mobile_DefaultReportDate:                                           'Report date',
    Mobile_EnableGraphsLabel:                                           'Display graphs',
    Mobile_Help:                                                        'Help',
    Mobile_LastUpdated:                                                 'Last Updated: %s',
    Mobile_MultiChartLabel:                                             'Display sparklines',
    Mobile_MultiChartInfo:                                              'next to each website on the welcome screen',
    Mobile_NetworkNotReachable:                                         'Network not reachable',
    Mobile_PullDownToRefresh:                                           'Pull down to refresh...',
    Mobile_Refresh:                                                     'Refresh',
    Mobile_ReleaseToRefresh:                                            'Release to refresh...',
    Mobile_SaveSuccessError:                                            'Please verify settings',
    Mobile_ShowAll:                                                     'Show all',
    Mobile_ShowLess:                                                    'Show less',
    Mobile_HttpTimeout:                                                 'HTTP Timeout',
    Mobile_HttpTimeoutInfo:                                             'increase if you receive timeout errors',
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

// these languages are not supported / does not work on android
if ('android' !== Titanium.Platform.osname) {
    Translation.AVAILABLE_LANGUAGES.ar = '\u0627\u0644\u0639\u0631\u0628\u064a\u0629';
    Translation.AVAILABLE_LANGUAGES.ka = '\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8';
    Translation.AVAILABLE_LANGUAGES.he = '\u05e2\u05d1\u05e8\u05d9\u05ea';
    Translation.AVAILABLE_LANGUAGES.te = '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41';
    Translation.AVAILABLE_LANGUAGES.th = 'ไทย';
}

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
Translation.get  = function (key) {

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
Translation.loadTranslations = function () {

    var locale = Translation.getLocale();
    
    if (!Translation.AVAILABLE_LANGUAGES || !Translation.AVAILABLE_LANGUAGES[locale]) {
    
        return;
    }
    
    try {
        Titanium.include('/i18n/' + locale  + '.js' );
    } catch (e) {
        Log.error('Failed to load translations for locale ' + locale, 'Translation');
    }
        
    Titanium.App.fireEvent('translationsLoaded', {});
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
    
    locale = Translation.getPlatformLocale();
    locale = locale.toLowerCase();
    
    Settings.setLanguage(locale);
    
    return locale;
};

/**
 * Queries the platform/device locale or a default value if the platform locale is not readable.
 * 
 * @returns  {string}  The platform locale.
 */
Translation.getPlatformLocale = function () {
    
    if (Titanium.Platform.locale) {
    
        var locale = Titanium.Platform.locale;
        
        if (locale && locale.substr) {
            
            // some devices return for example "de-de". we just want the first two characters
            return locale.substr(0, 2).toLowerCase();
        }
        
        return locale;
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

