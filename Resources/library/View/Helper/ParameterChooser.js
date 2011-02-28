/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   View helper which displays the current active standard parameters as described at 
 *          {@link http://dev.piwik.org/trac/wiki/API/Reference#Standardparameters}. This helper renderes its content
 *          into a TableViewRow. You need a TableView therefore to display the rendered content.
 * 
 * @property {Object}       [options]                 See {@link View_Helper#setOptions}
 * @property {string}       [options.period="day"]    Optional - The current active period.
 * @property {Object}       [options.currentSite]     Optional - The current active site as an object.
 * @property {Array}        [options.allowedSites]    Optional - An array of sites where the user has at least view access.
 *                                                               The format has to be similar to {@link http://piwik.org/demo/?module=API&method=SitesManager.getSitesWithAtLeastViewAccess&format=JSON&token_auth=anonymous}
 * @property {Date|string}  [options.date]            Optional - The current selected date. Can be either a Date object
 *                                                               or string in the following Format "YYYY-MM-DD". 
 *                                                               Defaults to the current date (now).
 * 
 * @augments View_Helper
 */
function View_Helper_ParameterChooser () {

    /**
     * Holds the current date the chooser internally works with.
     * 
     * @defaults null
     * 
     * @type Date
     */
    this.date    = null;

    /**
     * Holds the current period the chooser internally works with.
     * 
     * @defaults "day"
     *
     * @type String
     */
    this.period  = 'day';

    /**
     * Creates the 'subView' container and arranges the addition of each selector.
     *
     * @returns {View_Helper_ParameterChooser} An instance of the current state.
     */
    this.direct  = function () {

        var view = Titanium.UI.createTableViewRow({height: 40,
                                                   backgroundColor: '#f6f6f6'});
        
        this.addDayChooser(view);
        this.addSiteChooser(view);

        this.subView = view;

        this.initDate();

        return this;
    };
    
    /**
     * Get the rendered content of this parameter chooser.
     * 
     * @returns Titanium.UI.TableViewRow
     */
    this.getRow = function () {
        
        return this.subView;
    };

    /**
     * Adds a date and period selector. This allows the user to change the date and period.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addDayChooser = function (view) {
        
        var labelWidth = 'auto';
        
        if (100 < parseInt(this.view.width, 10)) {
            // there is a bug since Titanium Mobile SDK 1.4 which forces labels to wrap even if there is enough space left.
            // setting a width is a workaround to fix this bug.
            // @todo set this to auto as soon as this bug is completely fixed #wrapbug  
            
            labelWidth = parseInt(this.view.width, 10) / 2;
            labelWidth = parseInt(labelWidth, 10);
        }

        this.dateValue =  Titanium.UI.createLabel({
            text: ' - ',
            height: 'auto',
            width: labelWidth - 6,
            left: isAndroid ? 5 : 10,
            color: '#996600',
            font: {fontSize: config.theme.fontSizeNormal, fontWeight: 'bold', fontFamily: config.theme.fontFamily},
            zIndex: 6,
            ellipsize: true,
            wordWrap: true
        });

        this.period       = this.getOption('period', this.period);

        view.add(this.dateValue);
    };
    
    /**
     * Adds a site selector. This allows the user to switch between sites directly.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addSiteChooser = function (view) {

        var labelWidth = 'auto';
        if (100 < parseInt(this.view.width, 10)) {
            // there is a bug since Titanium Mobile SDK 1.3.2 which forces labels to wrap even if there is enough
            // space left. Setting a width is a workaround to fix this bug.
            // @todo set this to auto as soon as this bug is completely fixed #wrapbug  
            
            labelWidth = parseInt(this.view.width, 10) / 2;
            labelWidth = parseInt(labelWidth, 10);
        }
    
        var currentSite  = this.getOption('currentSite', {name: ''});

        this.siteChooser =  Titanium.UI.createLabel({
            text: currentSite.name,
            height: 'auto',
            right: isAndroid ? 5 : 10,
            color: '#996600',
            textAlign: 'right',
            width: labelWidth - 6,
            font: {fontSize: config.theme.fontSizeNormal, fontWeight: 'bold', fontFamily: config.theme.fontFamily},
            zIndex: 10,
            ellipsize: true,
            wordWrap: true
        });
        
        view.add(this.siteChooser);
    };

    /**
     * Builds a local date value and displays it within the date selector.
     *
     * @type null
     */
    this.initDate = function () {

        var optionDate = this.getOption('date', new Date());
        
        if ('string' === (typeof optionDate).toLowerCase()) {

            this.date  = optionDate.toPiwikDate();
            
        } else {
            
            this.date  = optionDate;
        }
        
        this.dateValue.text = this.date.toPiwikDateRangeString(this.period);
    };
}

/**
 * Extend View_Helper
 */
View_Helper_ParameterChooser.prototype = new View_Helper();
