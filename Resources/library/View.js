/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   The view is a part of the MVC pattern. It separates the view from the model and controller part.
 *          All values assigned to the view variable of a controller are accessible in this context.
 *
 * @augments Titanium.UI.View
 */
function View (params) {

    /**
     * Holds the parameters used to process the request / create a window. 
     * 
     * @type Object
     */
    this.params                   = params;

    /**
     * A counter to detect how often showWaitIndicator was called. Incrementes on each showWaitIndicator call and
     * decrements on each hideWaitIndicator call. This helps us to decide when we have to really hide the indicator.
     * Possible scenario:
     * 
     * showWaitIndicator
     * do some stuff - start process 1
     * showWaitIndicator
     * do some stuff - start process 2
     * do some stuff - end process 2
     * hideWaitIndicator    -> If we do not count how often showWaitIndicator was previously called and simply hide the
     *                         indicator as soon as this method is called, the first process still runs while
     *                         the indicator is already removed. Therefore we just have to decrement the counter here. 
     *                         We are not allowed to hide the indicator here..
     * do some stuff - end process 1
     * hideWaitIndicator    -> Because the number of 'show' and 'hide' calls are the same, we are allowed to really hide
     *                         the indicator now.
     * 
     * @type int
     */
    this.numWaitIndicatorRequests = 0;
 
    /**
     * Initial stuff.
     * 
     * @type null
     */
    this.init = function () {
        
        this.showWaitIndicator();
    };

    /**
     * Shows a waitIndicator. It uses the native activityIndicator therefore. 
     * To remove the waitIndicator simply call hideWaitIndicator as soon as your script has finished. Its useful to 
     * show the wait indicator for example as long as you fetch some data. Make sure to call the hide method. 
     * Otherwise the activityIndicator is displayed for a long time.
     * 
     * @example
     * this.showWaitIndicator();
     * doSomething();
     * this.hideWaitIndicator();
     * 
     * @type null
     */
    this.showWaitIndicator        = function () {
        
        /**
         * this is really important. if window is already closed (in android by pressing the back button) and this code
         * will be executed the app crashes. The app crashes cause the window is already closed while this code will be 
         * nevertheless executed. Creating an activityIndicator and add it to a closed window will crash the app.
         */
        if (this.isWindowClosed) { 
        
            return;
        } 
        
        Log.debug('showWaitIndicator', 'View');

        this.numWaitIndicatorRequests++;

        if (this.numWaitIndicatorRequests > 1) {

            return;
        }

        this.waitIndicatorImage = Titanium.UI.createActivityIndicator({
            height: 40,
            width: 40,
            message: '',
            style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
        });
        
        var _this = this;
        
        function waitIndicatorTimeout () {
            _this.hideWaitIndicator(true);
        }
        
        this.waitIndicatorTimeout = setTimeout(waitIndicatorTimeout, (parseInt(config.piwik.timeout, 10) * 1.6));

        this.waitIndicatorImage.show();

        if (this.add) {
            this.add(this.waitIndicatorImage);
        }
    };    

    /**
     * Hides the previously activated waitIndicator. Make sure to call the hide method in each possible case.
     * Attend that the wait indicator is removed as soon as the number of showWaitIndicator calls is the same as the
     * hideWaitIndicator calls.
     *
     * @param {boolean} [force=false]   if true it will definetly hide the wait indicator. Independently how often
     *                                  showWaitIndicator was called before.
     * 
     * @type null
     */
    this.hideWaitIndicator = function (force) {
        Log.debug('hideWaitIndicator' + this.numWaitIndicatorRequests, 'View');
        
        if (('undefined' !== (typeof force)) && force) {
            this.numWaitIndicatorRequests = 1;
        } 

        if (0 === this.numWaitIndicatorRequests) {

            return;
        }
        
        if (this.waitIndicatorTimeout) {
            clearTimeout(this.waitIndicatorTimeout);
            
            this.waitIndicatorTimeout = null;
        }
        
        if (this.isWindowClosed) { 
        
            return;
        } 

        this.numWaitIndicatorRequests--;

        if (0 !== this.numWaitIndicatorRequests) {

            return;
        }

        if (this.waitIndicatorImage && this.waitIndicatorImage.hide) {
            
            this.waitIndicatorImage.hide();
            
            if (this.remove) {
                this.remove(this.waitIndicatorImage);
            }
            
            this.waitIndicatorImage       = null;
            delete this.waitIndicatorImage;
            this.numWaitIndicatorRequests = 0;
        }

    };

    /**
     * Dynamically loads and instantiates a view helper. The helper must be located in the 'library/View/Helper' 
     * directory. The name of the file has to be {HelperNameUpperCaseFirst}.js and provide a class named 
     * 'View_Helper_{HelperNameUpperCaseFirst}'. You can use the view helper within the view template. 
     * Attend that it always creates a new instance of the helper. It does not return an previous 
     * created instance if you call this method twice using the same helper name. You are able to access this view 
     * within the helper using 'this.view'. Each view helper has to extend the View_Helper class and provide a 
     * method named 'direct', see {@link View_Helper}.
     * 
     * @param {string}   helper      The name of the helper you need.
     * @param {Object}   [options]   Optional options used to affect the helper. The possible options are different for
     *                               each helper. Have a look at the specific helper thus.
     *                               
     * @example
     * var head = this.helper('headline', {headline: 'Settings'});
     * 
     * @returns {Object} An instance of the helper.
     */
    this.helper  = function (helper, options) {
    
        helper   = helper.charAt(0).toUpperCase() + helper.substr(1);

        var path = '/library/View/Helper/' + helper + '.js';
        
        Log.debug('helper file is ' + path, 'View');
        
        Titanium.include(path);

        try {
            // this eval is not evil as the helper name is defined by us...
            var helperInstance = eval('new View_Helper_' + helper + '()');
            
        } catch (e) {
        
            helperInstance     = null;
        
            Log.debug('failed to include helper ' + helper, 'View');
        }
        
        if (!helperInstance) {
        
            return;
        }

        if (options) {
            helperInstance.setOptions(options);
        }

        helperInstance.setView(this);
        
        if (!helperInstance.direct) {
            Log.error('Required method of helper ' + helper + ' is not available', 'View');
            
            return helperInstance;
        }

        try {
        
            return helperInstance.direct();
            
        } catch (e) {
            Log.warn('An error occurred while rendering view helper ' + helper + ':' + e.message, 'View');
            
            return helperInstance;
        }
    };

    /**
     * Renders a specific view template. The finally rendered view depends on the current controller and given viewName.
     * All views has to be located within the views directory. Within that you have to create a folder for each 
     * controller (lower case first). The view has to be named {viewName}.js. The content of this file is executed in
     * View context. Therefore you can access the instance of this View class using 'this'. 
     * 
     * For example if controller="chart" and viewName="fullDetail" it uses the following file:
     * views/chart/fullDetail.js
     * 
     * @param {string}   viewName      The name of the view. The name is mapped to a view filename.
     * 
     * @example
     * this.render('index');
     * 
     * @type null
     */
    this.render = function (viewName) {

        // allow only portrait mode -> only supported by iPhone at Titanium Mobile SDK 1.4.0
        Titanium.UI.currentWindow.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT]; 
        
        if ('android' === Titanium.Platform.osname) {
            // set orientation to portrait -> currently the app does not render properly if the user changes the
            // orientation of an already rendered window. all new opened window (even in landscape mode) are rendered 
            // good
            // @todo support landscape mode.
            Titanium.UI.orientation = Titanium.UI.PORTRAIT;
        }
        
        this.show();
    
        if (!viewName) {
            Log.error('Can not render view, missing view name', 'View');
            
            return;
        }
    
        var firstLowerChar       = this.params.jsController.charAt(0).toLowerCase();
        var controllerLowerFirst = firstLowerChar + this.params.jsController.substr(1);

        if ('undefined' !== (typeof template)) {
            
            template = null;
        }
        
        try {
            var viewPath       = '/views/' + controllerLowerFirst + '/' + viewName + '.js';
            
            Log.debug('template file is ' + viewPath, 'View');
            
            Titanium.include(viewPath);
            
            // execute the view template in 'this' context.
            if ('undefined' !== typeof template && template) {
                template.apply(this, []);
            }
            
        } catch (e) {
            Log.warn('An error occurred while trying to render view ' + e.message, 'View');
        }

        this.hideWaitIndicator();
    };
    
    this.init();

}
