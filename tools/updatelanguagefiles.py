#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# A simple python script to fetch all available languages, fetch their translations and
# create a file for each language. The language file will contains only translations we need
# within Piwik Mobile. Stores the content in JSON having the following format:
# Object ( [language_key] => [language_translation] )
#
# Usage: ./updatelanguagefiles.py
#
import urllib, json

valid_translations =  {
        'CorePluginsAdmin_Activate':                                          'Activate',
        'CorePluginsAdmin_Deactivate':                                        'Deactivate',
        'CoreHome_PeriodDay':                                                 'Day',
        'CoreHome_PeriodWeek':                                                'Week',
        'CoreHome_PeriodMonth':                                               'Month',
        'CoreHome_PeriodYear':                                                'Year',
        'CoreHome_PeriodDays':                                                'days',
        'CoreHome_PeriodWeeks':                                               'weeks',
        'CoreHome_PeriodMonths':                                              'months',
        'CoreHome_PeriodYears':                                               'years',
        'CoreHome_TableNoData':                                               'No data for this table.',
        'CoreUpdater_UpdateTitle':                                            'Update',
        'Feedback_DoYouHaveBugReportOrFeatureRequest':                        'Do you have a bug to report or a feature request?',
        'General_AboutPiwikX':                                                'About Piwik %s',
        'General_Error':                                                      'Error',
        'General_Details':                                                    'Details',
        'General_Done':                                                       'Done',
        'General_Ok':                                                         'Ok',
        'General_Settings':                                                   'Settings',
        'General_Save':                                                       'Save',
        'General_ExceptionPrivilegeAtLeastOneWebsite':                        "You can't access this resource as it requires an %s access for at least one website.",
        'General_Close':                                                      'Close',
        'General_CurrentWeek':                                                'Current Week',
        'General_CurrentMonth':                                               'Current Month',
        'General_CurrentYear':                                                'Current Year',
        'General_Delete':                                                     'Delete',
        'General_Edit':                                                       'Edit',
        'General_ErrorRequest':                                               'Oops... problem during the request, please try again.',
        'General_ForExampleShort':                                            'eg.',
        'General_GiveUsYourFeedback':                                         'Give us Feedback!',
        'General_LoadingData':                                                'Loading data...',
        'General_LongMonth_1':                                                'January',
        'General_LongMonth_2':                                                'February',
        'General_LongMonth_3':                                                'March',
        'General_LongMonth_4':                                                'April',
        'General_LongMonth_5':                                                'May',
        'General_LongMonth_6':                                                'June',
        'General_LongMonth_7':                                                'July',
        'General_LongMonth_8':                                                'August',
        'General_LongMonth_9':                                                'September',
        'General_LongMonth_10':                                               'October',
        'General_LongMonth_11':                                               'November',
        'General_LongMonth_12':                                               'December',
        'General_NoDataForGraph':                                             'No data for this graph.',
        'General_NotValid':                                                   '%s is not valid',
        'General_Others':                                                     'Others',
        'General_PiwikXIsAvailablePleaseNotifyPiwikAdmin':                    '%s is available. Please notify the site administrator.',
        'General_Required':                                                   '%s required',
        'General_GeneralSettings':                                            'General Settings',
        'General_Today':                                                      'Today',
        'General_Unknown':                                                    'Unknown',
        'General_Value':                                                      'Value',
        'General_Yesterday':                                                  'Yesterday',
        'General_YourChangesHaveBeenSaved':                                   'Your changes have been saved.',
        'Login_Login':                                                        'Username',
        'Login_Password':                                                     'Password',
        'SitesManager_Cancel_js':                                             'Cancel',
        'SitesManager_ExceptionInvalidUrl':                                   "The url '%s' is not a valid URL.",
        'UsersManager_ManageAccess':                                          'Manage access',
        'UsersManager_PrivView':                                              'View',
        'VisitsSummary_EvolutionOverLastPeriods':                             'Evolution over the last %s',
        'General_InvalidResponse':                                            'The received data is invalid.',
        'General_ChooseLanguage':                                             'Choose language',
        'General_ChoosePeriod':                                               'Choose period',
        'General_ChooseWebsite':                                              'Choose website',
        'General_ChooseDate':                                                 'Choose date',
        'General_Language':                                                   'Language',
        'General_PleaseUpdatePiwik':                                          'Please update your Piwik',
        'General_RequestTimedOut':                                            'A data request to %s timed out. Please try again.',
        'Mobile_AddAccount':                                                  'Add account',
        'Mobile_Advanced':                                                    'Advanced',
        'Mobile_AnonymousAccess':                                             'Anonymous access',
        'Mobile_AccessUrlLabel':                                              'Piwik Access Url',
        'Mobile_ChooseHttpTimeout':                                           'Choose HTTP timeout value',
        'Mobile_DefaultReportDate':                                           'Report date',
        'Mobile_EnableGraphsLabel':                                           'Display graphs',
        'Mobile_Help':                                                        'Help',
        'Mobile_HttpIsNotSecureWarning':                                      "Your Piwik authToken is sent in clear text if you use 'HTTP'. For this reason we recommend HTTPS for secure transport of data over the internet. Do you want to proceed?",
        'Mobile_LastUpdated':                                                 'Last Updated: %s',
        'Mobile_MultiChartLabel':                                             'Display sparklines',
        'Mobile_MultiChartInfo':                                              'Next to each website on the welcome screen',
        'Mobile_NetworkNotReachable':                                         'Network not reachable',
        'Mobile_PullDownToRefresh':                                           'Pull down to refresh...',
        'Mobile_Refresh':                                                     'Refresh',
        'Mobile_Reloading':                                                   'Reloading...',
        'Mobile_ReleaseToRefresh':                                            'Release to refresh...',
        'Mobile_SaveSuccessError':                                            'Please verify settings',
        'Mobile_ShowAll':                                                     'Show all',
        'Mobile_ShowLess':                                                    'Show less',
        'Mobile_HttpTimeout':                                                 'HTTP Timeout',
        'Mobile_HttpTimeoutInfo':                                             'Increase if you receive timeout errors',
        'Mobile_VerifyAccount':                                               'Verify Account',
        'Mobile_YouAreOffline':                                               'Sorry, you are currently offline'
}

lang_params  = urllib.urlencode({'module': 'API', 'method': 'LanguagesManager.getAvailableLanguages', 'format': 'JSON', 'token_auth': 'anonymous'})

lang_handle  = urllib.urlopen("http://demo.piwik.org/?%s" % lang_params, proxies=None)
lang_content = lang_handle.read()
lang_array   = json.loads(lang_content)
for lang in lang_array:
    lang = lang[0]
    print 'found language ' + lang

    translation_params  = urllib.urlencode({'module': 'API', 'method': 'LanguagesManager.getTranslationsForLanguage', 'languageCode' : lang, 'format': 'JSON', 'token_auth': 'anonymous'}) 
    translation_handle  = urllib.urlopen("http://demo.piwik.org?%s" % translation_params, proxies=None);
    translation_content = translation_handle.read()
    translation_array   = json.loads(translation_content)

    result = {}
    for translation in translation_array:
        if translation['label'] in valid_translations:
            result[translation['label']] = translation['value']

    result_content = 'Piwik.Locale.Translation.translations = ' + json.dumps(result) + ';'
    file = open('../Resources/i18n/' + lang + '.js', 'w')
    file.write(result_content)
    file.close()
    print 'language ' + lang + ' processed'
