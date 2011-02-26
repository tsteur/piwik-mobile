/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   View helper which displays a list of statistics. The label is placed on the left side whereas the value
 *          is displayed on the right site. Additionally it is possible to add a headline for each column.
 * 
 * @property {Object}       options              See {@link View_Helper#setOptions}
 * @property {Array}        options.values       An array containing multiple values. Each value is represented by an 
 *                                               object which has to provide a property named 'title' and 'value'.
 *                                               The values are displayed in the same order as the array contains them. 
 *                                               Logo is optional and has to be an absolut path to an image (including)
 *                                               domain.
 *                                               Array (
 *                                                  [int] => Object (
 *                                                              [title] => []
 *                                                              [value] => []
 *                                                              [logo]  => []
 *                                                           )
 *                                               )
 * @property {Object}       [options.headline]         Optional - It is possible to set a headline for each column. 
 *                                                     That is for the labels and for the value column.
 * @property {string}       [options.headline.title]   Optional - The headline for the label column.
 * @property {string}       [options.headline.value]   Optional - The headline for the value column.
 * 
 * @augments View_Helper
 */
function View_Helper_StatisticList () {

    /**
     * The font size each label has to use. This shall ensure each label uses the same font size.
     *
     * @type int
     */
    this.fontSize    = config.theme.fontSizeNormal + 1;

    /**
     * The width of each left label within the statistic list.
     *
     * @defaults "auto"
     *
     * @type {Number|string}
     */
    this.leftLabelWidth  = 'auto';

    /**
     * The width of each right label within the statistic list.
     * 
     * 100 width - 10 left - 3 right = 107
     *
     * @defaults "87"
     *
     * @type {Number|string}
     */
    this.rightLabelWidth = 87;

    /**
     * Creates the 'subView' container and triggers the rendering of the statisic values.
     *
     * @returns {View_Helper_ParameterChooser} An instance of the current state.
     */
    this.direct = function () {

        if (100 < parseInt(this.view.width, 10)) {  
            this.leftLabelWidth  = parseInt(this.view.width, 10) - 100 - 20;
        }
        
        this.rows = [];

        this.renderHeadline();
        this.renderList();
        
        return this;
    };
    
    this.getRows = function () {
    
        return this.rows;
    }

    /**
     * Adds the headline to the list if one is given.
     *
     * @type null
     */
    this.renderHeadline = function () {
    
        if (!this.getOption('headline', null)) {
           // add headline only if given
         
           return;
        }
        
        var headline    = this.getOption('headline', {});
        
        var headlineRow = Ti.UI.createTableViewRow({backgroundColor: '#E4E2D7', 
                                                    height: 'auto', 
                                                    width: parseInt(this.view.width, 10)});

        var titleLabel = Titanium.UI.createLabel({
            text: headline.title ? headline.title : ' - ',
            height: 'auto',
            left: isAndroid ? 5 : 10,
            width: this.leftLabelWidth,
            color: config.theme.titleColor,
            top: isAndroid ? 10 : 13,
            bottom: 10,
            font: {fontSize: this.fontSize, fontFamily: config.theme.fontFamily}
        });
        
        var valueLabel = Titanium.UI.createLabel({
            text: headline.value ?  headline.value : ' - ',
            height: 'auto',
            right: 3,
            width: this.rightLabelWidth,
            color: config.theme.titleColor,
            top: isAndroid ? 10 : 13,
            bottom: 10,
            font: {fontSize: this.fontSize, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        headlineRow.add(titleLabel);
        headlineRow.add(valueLabel);
        
        this.rows.push(headlineRow);
    };

    /**
     * Adds the statistic values to the list.
     *
     * @type null
     */
    this.renderList  = function () {
    
        var values   = this.getOption('values', []);
    
        if (!values || !(values instanceof Array) || 0 === values.length) {
            
            var view = Ti.UI.createTableViewRow();
            
            var noDataInfoLabel = Titanium.UI.createLabel({
                text: _('CoreHome_TableNoData'),
                height: 38,
                left: 10,
                color: config.theme.textColor,
                font: {fontSize: this.fontSize, fontFamily: config.theme.fontFamily}
            });
            
            view.add(noDataInfoLabel);
            
            view.height = 38;
            
            this.rows.push(view);
         
           return;
        }
         
        var color    = config.theme.textColor;
        var bgColor  = null;

        // needed for odd/even detection
        var counter  = 0;
        
        var topValue  = isAndroid ? 10 : 13;
        var leftValue = isAndroid ? 5 : 10;

        for (var index = 0; index < values.length; index++) {
            var statistic = values[index];
            
            if (!statistic) {
                continue;
            }
         
            // @todo define config theme vars
            bgColor     = '#f5f5f5';
            if (counter % 2 == 1) {
                bgColor = config.theme.backgroundColor;
            }
        
            var statRow = Ti.UI.createTableViewRow({
                height: 'auto',
                width: parseInt(this.view.width, 10),
                backgroundColor: bgColor
            });
            
            var title    = String(statistic.title).trim();
            var value    = statistic.value;
            var logo     = null;
            
            if (('undefined' == typeof value) || null === value) {
                value    = ' - ';
            }
            
            if ('undefined' !== (typeof statistic.logo)) {
                logo     = statistic.logo;
            }
                
            var titleLabel = Titanium.UI.createLabel({
                text: String(title),
                height: 'auto',
                left: leftValue,
                width: this.leftLabelWidth,
                color: color,
                top: topValue, 
                bottom: 10,
                zIndex: 4,
                font: {fontSize: this.fontSize, fontFamily: config.theme.fontFamily}
            });
            
            statRow.add(titleLabel);

            var valueLabel = Titanium.UI.createLabel({
                text: String(value),
                height: 'auto',
                right: 3,
                width: this.rightLabelWidth,
                top: topValue, 
                bottom: 10,
                color: color,
                zIndex: 5,
                font: {fontSize: this.fontSize, fontFamily: config.theme.fontFamily, fontWeight: 'bold'}
            });
            
            statRow.add(valueLabel);

            if(logo) {
                var imageView = Titanium.UI.createImageView({
                    height: statistic.logoHeight ? statistic.logoHeight : 16,
                    image: String(logo),
                    left: 10,
                    zIndex: 6,
                    width: statistic.logoWidth ? statistic.logoWidth : 16
                });
                
                titleLabel.left      = 35;
                if ('android' === Titanium.Platform.osname) {
                    titleLabel.width = this.leftLabelWidth - 25;
                }
                
                statRow.add(imageView);
            }
            
            counter++;
            
            this.rows.push(statRow);
        }
    };
}

/**
 * Extend View_Helper
 */
View_Helper_StatisticList.prototype = new View_Helper();
