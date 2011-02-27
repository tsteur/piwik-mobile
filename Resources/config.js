/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   The config defines configuration data within the application. 
 *
 * @static
 *
 * @todo    complete this config. Only some values are currently defined here.
 */
var config = {};

/**
 * Piwik related settings.
 *
 * @type Object
 */
config.piwik = {
    timeout: 120000,
    /**
     * default row to be used in all statistics
     */
    usedRow: 'nb_visits',
    defaultPeriod: 'day', 
    defaultDate: 'yesterday',
    filterLimit: 50
};

config.graph = {Actions: {getDownloads: {chartType: 'pie'},
                          getOutlinks:  {chartType: 'pie'},
                          getPageTitles: {chartType: 'pie'}}
};

/**
 * The theme defines the colors, fonts and other styles used within the app.
 *
 * @type Object
 */
config.theme = {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    borderColor: '#666666',
    titleColor: '#336699',
    logoColor1: '#eede78',
    logoColor2: '#dfad6f',
    logoColor3: '#d57474',
    logoColor4: '#8d693f',
    logoColor5: '#684222',
    fontSizeNormal: 12,
    fontSizeHeadline: 21,
    fontSizeSmall: 9,
    fontSizeLarge: 18,
    fontFamily: 'Arial',
    borderRadius: 4

};

/**
 * returns the name of the row to be used
 */
config.getUsedRow = function (period) {
    if(period && period != 'day' && config.piwik.usedRow == 'nb_uniq_visitors') {
    
        return 'sum_daily_nb_uniq_visitors';
        
    } else {
    
        return config.piwik.usedRow;
    }
};

/**
 * returns the title of the used row
 * 
 * @todo move this to Translation
 */
config.getUsedRowTranslation = function () {
    
    var rowName  = '';
    var parts    = config.piwik.usedRow.split('_');
    
    for(var i=0; i<parts.length; i++) {
        rowName += parts[i].substring(0,1).toUpperCase() + parts[i].substring(1);
    }
    
    var translation = _('General_Column'+rowName);
    
    if(translation == 'General_Column'+rowName) {
    
        return _('General_Unknown');
        
    } else {
    
        return translation;
    }
};
