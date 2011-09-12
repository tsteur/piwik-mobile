/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Provides some translation related methods. The translations for each language are stored within the
 *          'Resources/i18n' folder. These files can be generated/updated via the python script
 *          'tools/updatelanguagefiles.py'.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#LanguagesManager">Piwik Languages Manager</a>
 *
 * @static
 */
Piwik.Locale.Translation = new function () {

    /**
     * This event will be fired as soon as the user changes the language and the translations of the changed selected
     * language are loaded.
     *
     * @name    Piwik.Locale.Translation#event:onTranslationsLoaded
     * @event
     * @context {Ti.App}
     *
     * @param   {Object}    event
     * @param   {string}    event.type    The name of the event.
     *
     * @todo add an eventListener to this event and refresh each window as soon as one changes the langauge/translations
     * are loaded?
     */

    /**
     * The translations depending on the current active/selected locale.
     * 
     * @type null|Object
     *
     * Object ( [translationKey] => [Translated value] )
     */
    this.translations = null;

    /**
     * Default translations are used if no language was chosen or if chosen language is not provided by
     * the piwik LanguageManager.
     *
     * @type {Object}
     *
     * Object ( [translationKey] => [default translation] )
     *
     * @constant
     */
    this.DEFAULT_TRANSLATION = {

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
        CustomVariables_CustomVariables:                                    'Custom Variables',
        Feedback_DoYouHaveBugReportOrFeatureRequest:                        'Do you have a bug to report or a feature request?',
        Feedback_ThankYou:                                                  'Thank you for helping us to make Piwik better!',
        General_AboutPiwikX:                                                'About Piwik %s',
        General_Error:                                                      'Error',
        General_Details:                                                    'Details',
        General_Done:                                                       'Done',
        General_Ok:                                                         'Ok',
        General_Settings:                                                   'Settings',
        General_Save:                                                       'Save',
        General_ExceptionPrivilegeAtLeastOneWebsite:                        "You can't access this resource as it requires an %s access for at least one website.",
        General_Close:                                                      'Close',
        General_ColumnNbVisits:                                             'Visits',
        General_ColumnPageviews:                                            'Pageviews',
        General_CurrentWeek:                                                'Current Week',
        General_CurrentMonth:                                               'Current Month',
        General_CurrentYear:                                                'Current Year',
        General_Delete:                                                     'Delete',
        General_Edit:                                                       'Edit',
        General_ErrorRequest:                                               'Oops... problem during the request, please try again.',
        General_ForExampleShort:                                            'eg.',
        General_FromReferrer:                                               'From',
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
        General_NewVisitor:                                                 'New Visitor',
        General_Next:                                                       'Next',
        General_No:                                                         'No',
        General_NoDataForGraph:                                             'No data for this graph.',
        General_NotValid:                                                   '%s is not valid',
        General_NumberOfVisits:                                             'Number of visits',
        General_Others:                                                     'Others',
        General_PiwikXIsAvailablePleaseNotifyPiwikAdmin:                    '%s is available. Please notify the site administrator.',
        General_Previous:                                                   'Previous',
        General_Reports:                                                    'Reports',
        General_Required:                                                   '%s required',
        General_GeneralSettings:                                            'General Settings',
        General_Subtotal:                                                   'Subtotal',
        General_Today:                                                      'Today',
        General_Unknown:                                                    'Unknown',
        General_Value:                                                      'Value',
        General_VisitConvertedNGoals:                                       'Visit converted %s Goals',
        General_VisitorIP:                                                  'Visitor IP',
        General_Visitors:                                                   'Visitors',
        General_VisitType:                                                  'Visitor type',
        General_Yes:                                                        'Yes',
        General_Yesterday:                                                  'Yesterday',
        General_YourChangesHaveBeenSaved:                                   'Your changes have been saved.',
        Goals_AbandonedCart:                                                'Abandoned Cart',
        Goals_Ecommerce:                                                    'Abandoned',
        Goals_EcommerceOrder:                                               'Ecommerce order',
        Live_GoalRevenue:                                                    'Revenue',
        Live_LastHours:                                                     'Last %s hours',
        Live_LastMinutes:                                                   'Last %s minutes',
        Live_VisitorsInRealTime:                                            'Visitors in Real Time',
        Live_VisitorLog:                                                    'Visitor Log',
        Login_Login:                                                        'Username',
        Login_Password:                                                     'Password',
        SEO_Rank:                                                           'Rank',
        SitesManager_Cancel_js:                                             'Cancel',
        SitesManager_ExceptionInvalidUrl:                                   "The url '%s' is not a valid URL.",
        UserCountry_Country:                                                'Country',
        UsersManager_ManageAccess:                                          'Manage access',
        UsersManager_PrivView:                                              'View',
        UserSettings_ColumnBrowser:                                         'Browser',
        UserSettings_Plugins:                                               'Plugins',
        UserSettings_ColumnResolution:                                      'Resolution',
        UserSettings_VisitorSettings:                                       'Visitor Settings',
        VisitsSummary_NbVisits:                                             '%s visits',
        VisitsSummary_EvolutionOverLastPeriods:                             'Evolution over the last %s',
        VisitsSummary_NbActions:                                            '%s actions',

        // New Strings
        General_InvalidResponse:                                            'The received data is invalid.',
        General_ChooseLanguage:                                             'Choose language',
        General_ChoosePeriod:                                               'Choose period',
        General_ChooseWebsite:                                              'Choose website',
        General_ChooseDate:                                                 'Choose date',
        General_Language:                                                   'Language',
        General_PleaseUpdatePiwik:                                          'Please update your Piwik',
        General_RequestTimedOut:                                            'A data request to %s timed out. Please try again.',
        General_Outlink:                                                    'Outlink',
        General_Download:                                                   'Download',
        General_Goal:                                                       'Goal',
        General_Help:                                                       'Help',
        General_Visitor:                                                    'Visitor',
        Mobile_AddAccount:                                                  'Add account',
        Mobile_Advanced:                                                    'Advanced',
        Mobile_AnonymousAccess:                                             'Anonymous access',
        Mobile_AnonymousTracking:                                           'Anonymous tracking',
        Mobile_AccessUrlLabel:                                              'Piwik Access Url',
        Mobile_AskForAnonymousTrackingPermission:                           'When enabled, Piwik Mobile will send anonymous usage data to piwik.org. The intent is to use this data to help Piwik Mobile developers better understand how the app is used. Information sent is: menus and settings clicked on, OS name and version, any error displayed in Piwik Mobile. We will NOT track any of your analytics data. This anonymous data will never be made public. You can disable/enable anonymous tracking in Settings at any time.',
        Mobile_ChooseHttpTimeout:                                           'Choose HTTP timeout value',
        Mobile_DefaultReportDate:                                           'Report date',
        Mobile_EnableGraphsLabel:                                           'Display graphs',
        Mobile_HelpUsToImprovePiwikMobile:                                  'Would you like to enable anonymous usage tracking in Piwik Mobile?',
        Mobile_HttpIsNotSecureWarning:                                      "Your Piwik authorization token (token_auth) is sent in clear text if you use 'HTTP'. For this reason we recommend HTTPS for secure transport of data over the internet. Do you want to proceed?",
        Mobile_LastUpdated:                                                 'Last Updated: %s',
        Mobile_MultiChartLabel:                                             'Display sparklines',
        Mobile_MultiChartInfo:                                              'Next to each website on the welcome screen',
        Mobile_NavigationBack:                                              'Back',
        Mobile_NetworkNotReachable:                                         'Network not reachable',
        Mobile_PullDownToRefresh:                                           'Pull down to refresh...',
        Mobile_Refresh:                                                     'Refresh',
        Mobile_Reloading:                                                   'Reloading...',
        Mobile_ReleaseToRefresh:                                            'Release to refresh...',
        Mobile_SaveSuccessError:                                            'Please verify settings',
        Mobile_SearchWebsite:                                               'Search websites',
        Mobile_ShowAll:                                                     'Show all',
        Mobile_ShowLess:                                                    'Show less',
        Mobile_HttpTimeout:                                                 'HTTP Timeout',
        Mobile_HttpTimeoutInfo:                                             'Increase if you receive timeout errors',
        Mobile_VerifyAccount:                                               'Verifying Account',
        Mobile_YouAreOffline:                                               'Sorry, you are currently offline'
    };

    /**
     * Available languages.
     * This list should be updated every time a new language is released to piwik. We could also automatically fetch a
     * list of all available languages via api before releasing a new version. But not each language is supported/works
     * on each platform. We have to test each new language before adding it.
     *
     * @type {Object}
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
    if (Piwik.isIos) {
        this.AVAILABLE_LANGUAGES.ar = '\u0627\u0644\u0639\u0631\u0628\u064a\u0629';
        this.AVAILABLE_LANGUAGES.ka = '\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8';
        this.AVAILABLE_LANGUAGES.he = '\u05e2\u05d1\u05e8\u05d9\u05ea';
        this.AVAILABLE_LANGUAGES.te = '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41';
        this.AVAILABLE_LANGUAGES.th = 'ไทย';
    }

    /**
     * Returns the translation for the given key if one exists or the key itself if not.
     *
     * @param   {string}    key   key to translation
     *
     * @returns {string}    Translated key. Uses the value defined in {@link Translation.translations} or the default
     *                      translation if no translation exists for the given key. If even the default value does not
     *                      exist it returns the key and logs an error. In such a case you have to define a default
     *                      translation for the given key, see {@link Translation.DEFAULT_TRANSLATION}.
     */
    this.get  = function (key) {

        if (this.translations && this.translations[key]) {

            return this.translations[key];

        }

        if (this.DEFAULT_TRANSLATION[key]) {

            return this.DEFAULT_TRANSLATION[key];
        }

        Piwik.Log.error('Missing default translation for key ' + key, 'Piwik.Locale.Translation::get');

        return key;
    };

    /**
     * Fetches all needed translations depending on the current locale.
     *
     * @fires Piwik.Locale.Translation#event:onTranslationsLoaded
     */
    this.load = function () {

        var locale = Piwik.require('Locale');
        locale     = locale.getLocale();

        if (!this.AVAILABLE_LANGUAGES || !this.AVAILABLE_LANGUAGES[locale]) {
            // no valid locale

            return;
        }

        try {
            Ti.include('/i18n/' + locale  + '.js' );
        } catch (e) {
            Piwik.Log.error('Failed to load translations for locale ' + locale, 'Piwik.Locale.Translation::load');

            var uiError = Piwik.UI.createError({exception: e, errorCode: 'PiTrLo35'});
            uiError.showErrorMessageToUser();
        }

        Ti.App.fireEvent('onTranslationsLoaded', {type: 'onTranslationsLoaded'});
    };

    /**
     * Returns a map of all available/supported languages.
     *
     * @see Translation#AVAILABLE_LANGUAGES
     *
     * @returns {Object} All available languages
     */
    this.getAvailableLanguages = function () {

        return this.AVAILABLE_LANGUAGES;
    };
};

/**
 * Translation wrapper. Use this method if you want to translate any text within the application.
 *
 * @see Piwik.Locale.Translation#get
 * 
 * @param   {string}  key
 *
 * @example
 * _('General_Login') // outputs 'Login' if language is english.
 *
 * @returns {string}  The translated key.
 */
function _(key) {

    return Piwik.Locale.Translation.get(key);
}

