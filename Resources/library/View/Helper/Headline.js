/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class  View helper which displays a headline. The helper includes icons which allows to navigate to the 
 *         setting tab and to close the current window (go back).
 *
 * @param  {Object}   [options]                              See {@link View_Helper#setOptions}
 * @param  {boolean}  [options.backButtonHidden=false]       Optional - true if back button should be hidden from view.
 *                                                           This option is not recognized on Android as there exists
 *                                                           a hardware back button.
 * @param  {string}   [options.headline=""]                  Optional - The headline.
 * 
 * @augments View_Helper
 */
function View_Helper_Headline () {

    /**
     * Creates the 'subView' container and arranges the addition of the headline and icons.
     *
     * @returns {View_Helper_Headline} An instance of the current state.
     */
    this.direct  = function () {
        
        /**
         * @todo replace bgImage by gradient as soon as Titanium supports it in Android
         * backgroundGradient: {
         *    type:'linear',
         *    colors:[{color:'#C8C5BC',position:0.0},{color:'#BEBAB1',position:0.50},{color:'#B2AEA6',position:1.0}]
         * } 
         */
        var view = Titanium.UI.createView({
            height: 40,
            top: this.getOption('top', 0),
            left: 0,
            right: 0,
            backgroundImage: 'images/bgheadline.png'
        });

        this.addHeadline(view);
        this.addTools(view);

        this.subView = view;
        
        return this;
    };

    /**
     * Adds the headline.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addHeadline = function (view) {
    
        var labelWidth = 'auto';
        var top        = 6;
        
        if ('android' === Titanium.Platform.osname && 100 < parseInt(this.view.width, 10)) {
            // there is a bug since Titanium Mobile SDK 1.4 which forces labels to wrap even if there is enough space
            // left. setting a width is a workaround to fix this bug.
            // @todo set this to auto as soon as this bug is completely fixed #wrapbug
            labelWidth = parseInt(this.view.width, 10) - 30;
            top        = 5;
        }

        this.headline = Titanium.UI.createLabel({
            text: this.getOption('headline', ''),
            height: 'auto',
            left: 10,
            top: top,
            width: labelWidth,
            shadowColor: config.theme.borderColor,
            shadowOffset: {x: 0, y: 1},
            color: config.theme.backgroundColor,
            font: {fontSize: config.theme.fontSizeHeadline, fontFamily: config.theme.fontFamily}
        });
        
        view.add(this.headline);
    };
    
    /**
     * Refreshes the display of the headline view helper. Especially refreshes the text of the headline.
     *
     * @type null
     */
    this.refresh = function () {
    
        if (this.headline && 'undefined' !== (typeof this.headline.text)) {
            this.headline.text = this.getOption('headline', '');
        }
    };

    /**
     * Adds the functional icons beside the headline.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addTools = function (view) {
        
        var backButtonHidden = this.getOption('backButtonHidden', false);
        
        if ('android' === Titanium.Platform.osname) {
            // not enabled on android devices because of an existing hardware back button.
            backButtonHidden = true;
        } else {
            var zIndex = 1;
            
            if (this.view && this.view.zIndex) {
                zIndex = this.view.zIndex;
            } else if (Titanium.UI.currentWindow.zIndex) {
                zIndex = Titanium.UI.currentWindow.zIndex;
            } else {
                Log.warn('no zIndex for the current window is set. Please set one.', 'Missing zIndex');
            }
            
            if (1 === zIndex) {
                // never ever display the back button when it is the first window on iOS. Otherwise the user is able to 
                // close the first window. This will result in a blank (white) window.
                backButtonHidden = true;
            }
        }
        
        if (!backButtonHidden) {
            
            var win = this.view;
            
            this.backIcon = Titanium.UI.createButton({
                image: 'images/icon/back.png',
                width: 43,
                height: 30,
                top: 4,
                right: 8,
                zIndex: 10
            });
            
            if ('android' !== Titanium.Platform.osname) {
                this.backIcon.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
            }
            
            view.add(this.backIcon);
            
            this.backIcon.addEventListener('click', function () {

                Window.close();

            });
            
            view.add(this.backIcon);
        }
    };
}

/**
 * Extend View_Helper
 */
View_Helper_Headline.prototype = new View_Helper();
