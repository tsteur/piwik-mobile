/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   The ActionController provides basic features needed in every controller. Therefore, all controllers 
 *          should extend this controller because eg. the Dispatcher requires some of these methods. 
 * 
 * @see <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Picker-object">Titanium.UI.Picker</a>
 */
function ActionController () {

    /**
     * Holds the view object where everything should rendered into. All assigned values to this property are available
     * in the view.
     * 
     * @example 
     * this.view.numVisitors = 20;
     * 
     * @type Titanium.Ui.View
     */
    this.view     = {};

    /**
     * Holds the parameters used to process the request / create a window. 
     * You should not directly use this property. It's better to use the existing getter/setter methods.
     * 
     * @type Object
     * 
     * @private
     */
    this.params   = {};

    /**
     * Sets (overwrites) the view. You should keep in mind to not change the view during the rendering process.
     * 
     * @see <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.View-object">Titanium.UI.View</a>
     * 
     * @param {Titanium.UI.View} view  Currently the view is always a Titanium.UI.Window object. But this is not a 
     *                                 requirement. It also could be any other view eg. Titanium.UI.View or 
     *                                 Titanium.UI.Webview.
     * 
     * @type null
     */
    this.setView  = function (view) {
        
        this.view = view;
        
    };

    /**
     * Each controller can override this init method. It is called before the requested Action is called and can be 
     * used to do some initial stuff which is needed for each action within a controller.
     * 
     * @type null
     */
    this.init = function () {
    
    };

    /**
     * Sets (overwrites) the originally used (request) parameters.
     * 
     * @param {Object}   params
     * 
     * @type null
     */
    this.setParams  = function (params) {

        this.params = params;

    };

    /**
     * Retrieve a specific param from previous set parameters.
     * 
     * @param {string}   param              The name of the param you want to retrieve.
     * @param {*}        [defaultValue]     The defaultValue if the param was not set previously or 
     *                                      if the value of the requested param is null.
     * 
     * @returns Returns the value of the requested parameter if this is not empty or the defaultValue if one specified. 
     *          In all other cases it returns null.
     *
     */
    this.getParam   = function (param, defaultValue) {

        if (param && this.params && this.params[param]) {

            return this.params[param];
        }

        if (defaultValue) {
            
            return defaultValue;
        }

    };

    /**
     * Dynamically loads and instantiates a model. The model must be located in the 'model' directory. The name of the
     * file has to be {ModelNameUpperCaseFirst}Model.js and provide a class named  {ModelNameUpperCaseFirst}Model.
     * 
     * @param {string}   modelName   The name of the model you need an instance. The word 'Model' is appended 
     *                               automatically.
     * 
     * @returns {Object} An instance of the model.
     */
    this.getModel = function (modelName) {
        
        if (!modelName) {
            return;
        }
        
        // Ensure upper case first for modelName
        var firstUpperChar   = modelName.charAt(0).toUpperCase();
        var modelNameUcFirst = firstUpperChar + modelName.substr(1);
        var model            = null;
        
        try {
       
            // @todo verify to include only once?
            Titanium.include('/model/' + modelNameUcFirst + 'Model.js');
        
            // eval is not evil in this case because the model names are specified by us
            model = eval('new ' + modelNameUcFirst + 'Model()');
            
        } catch (e) {
            
            Log.warn('Failed to load model ' + modelName + ':' + e.message, 'ActionController');
        }
        
        if (model && model.setContext) {
            
            // execute all possible callbacks or anything similar in controller content.
            model.setContext(this);
        }
        
        return model;
    };

    /**
     * Triggers the render process.
     * 
     * @see View
     * 
     * @param {string}   viewName   The name of the view you want to render.
     * 
     * @type null
     */
    this.render = function (viewName) {

        this.view.render(viewName);

    };
};
