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
     * Because Titanium does not have a layout manager (at least not for android) we have to count the current top
     * position ourselves.
     *
     * @type int
     */
    this.topValue    = 1;

    /**
     * The font size each label has to use. This shall ensure each label uses the same font size.
     *
     * @type int
     */
    this.fontSize    = config.theme.fontSizeNormal;

    /**
     * The height of one row in pixel. This is needed to calculate the top position of the next view.
     *
     * @type int
     */
    this.labelHeight = 29;

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
     * 120 width - 10 left - 3 right = 107
     *
     * @defaults "107"
     *
     * @type {Number|string}
     */
    this.rightLabelWidth = 107;

    /**
     * Creates the 'subView' container and triggers the rendering of the statisic values.
     *
     * @returns {View_Helper_ParameterChooser} An instance of the current state.
     */
    this.direct = function () {
        
        /**
         * Some titles are longer than one line. To ensure the user is able to read the whole title we have to set a
         * a higher label height. It is more a hack than a good solution. Unfortunately we can not use an 'auto' height 
         * where the view arranges the needed height themselves because it is not possible to get the height of the
         * whole rendered list in such a case. The view templates need the height of the rendered list (subView) for 
         * further positioning.
         *
         * @todo we should think about a logic which calculates the height of each view depending on the number of 
         *       characters and screen size. The widest charcter should be a 'w'. Depending on this width we are  
         *       - perhaps - able to calculate a better label height. A problem is not calculateable word wraps.
         */
        if (330 > this.view.size.width) {
            this.labelHeight = 38;
        }
        
        if ('android' === Titanium.Platform.osname && 100 < parseInt(this.view.size.width, 10)) {
            // there is a bug since Titanium Mobile SDK 1.3.2 which forces labels to wrap even if there is enough 
            // space left. Setting a width is a workaround to fix this bug.
            // @todo set this to auto as soon as this bug is completely fixed #wrapbug  
            this.leftLabelWidth  = parseInt(this.view.size.width, 10) - 120 - 30;
        }

        var view = Titanium.UI.createView({
            width:  this.view.size.width - 10,
            height: 'auto',
            top: 1,
            left: 1,
            right: 1,
            zIndex: 2,
            borderColor: config.theme.backgroundColor,
            borderRadius: config.theme.borderRadius,
            backgroundColor: config.theme.backgroundColor
        });
        
        this.renderHeadline(view);
        this.renderList(view);
        
        this.subView = view;
        
        return this;
    };

    /**
     * Adds the headline to the list if one is given.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.renderHeadline = function (view) {
    
        if (!this.getOption('headline', null)) {
           // add headline only if given
         
           return view;
        }
        
        var headline = this.getOption('headline', {});
    
        var leftView = Ti.UI.createView({
            height: this.labelHeight,
            top: this.topValue,
            left: 1,
            right: 121,
            backgroundColor: '#E4E2D7'
        });

        var rightView = Titanium.UI.createView({
            height: this.labelHeight,
            top: this.topValue,
            right: 1,
            width: 120,
            backgroundColor: '#D5D3C8'
        });
        
        var titleLabel = Titanium.UI.createLabel({
            text: ' - ',
            height: 'auto',
            left: 10,
            top: 4,
            width: this.leftLabelWidth,
            color: config.theme.titleColor,
            font: {fontSize: this.fontSize, fontFamily: config.theme.fontFamily}
        });
        
        var valueLabel = Titanium.UI.createLabel({
            text: ' - ',
            height: 'auto',
            left: 10,
            top: 4,
            width: this.rightLabelWidth,
            color: config.theme.titleColor,
            font: {fontSize: this.fontSize, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });

        if (headline.title) {
            titleLabel.text = headline.title;
        }

        if (headline.value) {
            valueLabel.text = headline.value;
        }
        
        this.topValue += this.labelHeight;
        
        leftView.add(titleLabel);
        rightView.add(valueLabel);
        view.add(leftView);
        view.add(rightView);
        
        view.height = this.topValue;
    };

    /**
     * Adds the statistic values to the list.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.renderList = function (view) {
    
        var values       = this.getOption('values', []);
    
        if (!values || !(values instanceof Array) || 0 === values.length) {
            
            var noDataInfoLabel = Titanium.UI.createLabel({
                text: _('CoreHome_TableNoData'),
                height: this.labelHeight,
                left: 10,
                top: this.topValue,
                color: config.theme.textColor,
                font: {fontSize: this.fontSize, fontFamily: config.theme.fontFamily}
            });
            
            view.add(noDataInfoLabel);
            
            this.topValue += this.labelHeight;
            view.height = this.topValue + 1;
         
           return;
        }
         
        var color        = config.theme.textColor;
        var leftBgColor  = null;
        var rightBgColor = null;

        // needed for odd/even detection
        var counter      = 0;
        
        for (var index = 0; index < values.length; index++) {
            var statistic = values[index];
            
            if (!statistic) {
                continue;
            }
            
            var title    = statistic.title;
            var value    = statistic.value;
            var logo     = null;
            
            if ('undefined' !== (typeof statistic.logo)) {
                logo     = statistic.logo;
            }
         
            // @todo define config theme vars
            leftBgcolor  = '#f5f5f5';
            rightBgcolor = '#eeedeb';
            
            if (counter % 2 == 1) {
                leftBgcolor  = config.theme.backgroundColor;
                rightBgcolor = '#f5f4f2';
            }

            var leftView = Ti.UI.createView({
                height: this.labelHeight,
                top: this.topValue,
                left: 1,
                right: 121,
                backgroundColor: leftBgcolor
            });
            
            var rightView = Ti.UI.createView({
                height: this.labelHeight,
                top: this.topValue,
                right: 1,
                width: 120,
                backgroundColor: rightBgcolor
            });

            var titleLabel = Titanium.UI.createLabel({
                text: String(title),
                height: 'auto',
                left: 10,
                top: 5,
                width: this.leftLabelWidth,
                color: color,
                font: {fontSize: this.fontSize, fontFamily: config.theme.fontFamily}
            });

            var valueLabel = Titanium.UI.createLabel({
                text: ' - ',
                height: 'auto',
                left: 10,
                top: 5,
                width: this.rightLabelWidth,
                color: color,
                font: {fontSize: this.fontSize, fontFamily: config.theme.fontFamily}
            });

            if(logo) {
                var imageView = Titanium.UI.createImageView({
                    height: 'auto',
                    image: logo,
                    left: 10,
                    top: 5,
                    width: 'auto'
                });
                
                titleLabel.left      = 35;
                if ('android' === Titanium.Platform.osname) {
                    titleLabel.width = this.leftLabelWidth - 25;
                }
                
                leftView.add(imageView);
            }
            
            if (('undefined' !== typeof value) && null !== typeof value) {
                valueLabel.text = "" + value;
            }
            
            this.topValue += this.labelHeight;
            counter++;
            
            leftView.add(titleLabel);
            rightView.add(valueLabel);
            view.add(leftView);
            view.add(rightView);
            
            /**
             * this is important because the view template otherwise can't access the height. the height is needed
             * for further positioning within the view template.
             */
            view.height = this.topValue + 1;
        }
    };
}

/**
 * Extend View_Helper
 */
View_Helper_StatisticList.prototype = new View_Helper();
