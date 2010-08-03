/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   Provides methods needed in each helper and serves as a base class for each view helper. A view helper 
 *          has to extend this class and make a 'direct' method available. The direct method is called once a view 
 *          helper is created within the view. 'options' and 'view' are set automatically by {@link View#helper}.
 */
function View_Helper () {

    /**
     * Options used to affect how the view helper shall work.
     * 
     * @type Object
     *
     * @see View_Helper#setOptions
     */
    this.options = {};

    /**
     * The instance of the current view.
     * 
     * @type Titanium.UI.View
     *
     * @see View_Helper#setView
     */
    this.view    = {};
    
    /**
     * A titanium view. The helper shall render everything into this property/view. This subView property can be used to  
     * add the rendered content of the helper into a window, later. Make sure to set this property while creating a view
     * helper.
     * 
     * @type Titanium.UI.View
     */
    this.subView = null;
    
    /**
     * Sets (overwrites) the options.
     * 
     * @param  {Object}   options  Options used to affect how the view helper should work. Each view helper has 
     *                             to define his own options as needed.
     *                          
     * 
     * @type null
     */
    this.setOptions  = function (options) {

        this.options = options;

    };

    /**
     * Sets (overwrites) the current window.
     * 
     * @param  {Titanium.UI.View}   view  An instance of the current window / {@link View}.
     * 
     * @type null
     */
    this.setView  = function (view) {

        this.view = view;

    };

    /**
     * Retrieve a single value from previous set options.
     * 
     * @param {string}   key                The name of the property/option you want to retrieve.
     * @param {*}        [defaultValue]     The defaultValue if the options does not have such a property or 
     *                                      if the value of the requested option is null.
     * 
     * @returns Returns the value of the requested option if this is not empty or the defaultValue if one specified. 
     *          In all other cases it returns null.
     */
    this.getOption = function (key, defaultValue) {
    
        if (this.options && this.options[key]) {
        
            return this.options[key];
        }
        
        if (defaultValue) {
        
            return defaultValue;
        }
    };

    /**
     * This method is called to do the helper specific stuff. In most cases this method should return his own instance
     * using 'return this' because this value is returned to the creator of the view helper.
     * 
     * @type View_Helper   
     */
    this.direct  = function () {
        throw new Error('direct() method is not implemented by the view helper');
    };
}
