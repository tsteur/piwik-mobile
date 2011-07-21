/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   The top level UI module. The module contains methods to create UI widgets and to handle the layout as well
 *          as the current window.
 *
 * @static
 */
Piwik.UI = {};

/**
 * Points to the current opened Piwik window if one is opened. Null otherwise.
 *
 * @type null|Piwik.UI.Window
 */
Piwik.UI.currentWindow = null;

/**
 * Points to the application layout. The layout can be bootstrapped via the bootstrap() method. Is null if no layout
 * was previously bootstrapped.
 *
 * @type null|Object
 */
Piwik.UI.layout = null;

/**
 * Bootstrap the UI / Layout.
 *
 * @param   {Object}   [options]
 * @param   {Object}   [options.layoutUrl]      Optional. Absolute url to the Piwik layout. If given, it immediately
 *                                              initializes the layout.
 */
Piwik.UI.bootstrap = function (options) {

    if (options && options.layoutUrl) {
        
        var layout  = Piwik.requireWindow(options.layoutUrl);

        this.layout = new layout();

        this.layout.init();
    }
};

/**
 * Creates a new window and displays it in front of the currently displayed window. Therefore it creates a new
 * Titanium.UI.View. The specified url defines which content is displayed within the window.
 * Titanium differences between lightweight and heavyweight windows. We don't use heavyweight windows cause heavyweight
 * windows has there own JavaScript subcontext. It is much faster to just work with one context. The disadvantage is
 * that we have to care a bit more about leaks and so on.
 *
 * @param {Object}    params                             All needed params to display the window and process the request.
 * @param {string}    params.url                         The url to the window with the windows instructions. The url
 *                                                       has to be relative to the 'Resources/windows' directory.
 * @param {string}    [params.exitOnClose=false]         if true, it makes sure android exits the app when this
 *                                                       window is closed and no other activity (window) is running
 * @param {boolean}   [params.closeCurrentWindow=false]  If true, it closes the currently displayed window.
 * @param {*}         params.*                           You can pass other parameters as you need it. The created
 *                                                       controller and view can access those values. You can use
 *                                                       this for example if you want to pass a site, date, period
 *                                                       parameter or something else. You can also use all
 *                                                       'Titanium.UI.Window' parameters.
 *
 *
 * @see <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Window-object">Titanium.UI.Window</a>
 *
 * @type Piwik.UI.Window
 * 
 * @returns The created window instance.
 */
Piwik.UI.createWindow = function (params) {

    if (!params) {
        params = {};
    }

    try {
        var url                = params.url;

        // increase the zIndex, ensures the next window will be displayed in front of the current window
        this.layout.zIndex     = this.layout.zIndex + 1;
        params.zIndex          = this.layout.zIndex;
        params.deleteOnScroll  = false;
        params.className       = 'piwikWindow';

        // newWin is the view we will render everything into
        var newWin             = Ti.UI.createView(params);

        // delete params.className cause we just need it for view creation.
        delete params.className;

        // load the requested template
        var winTemplate        = Piwik.requireWindow(url);

        Piwik.include('library/Piwik/UI/Window.js');
        
        // extend newWin
        Piwik.UI.Window.apply(newWin, []);

        if (params.closeCurrentWindow && Piwik.UI.currentWindow) {
            Piwik.UI.currentWindow.close(true);
        }

        // add window to layout so that it will be visible afterwards
        this.layout.addWindow(newWin);
        
        Piwik.UI.currentWindow = newWin;
        newWin.deleteOnScroll  = true;

        // extend newWin again and render the requested template
        winTemplate.apply(newWin, [params]);

        // open the new window. At this moment, the basic window is rendered and we just have to request the data
        // (async if possible).
        newWin.open(params);

        if (newWin.focus) {
            newWin.focus();
        }

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiCw12'});
        uiError.showErrorMessageToUser();
    }

    return newWin;
};

/**
 * Creates a new date picker instance.
 *
 * @see Piwik.UI.DatePicker
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.DatePicker.
 *
 * @type Piwik.UI.DatePicker
 *
 * @returns The created date picker instance.
 */
Piwik.UI.createDatePicker = function (params) {

    if (!params) {
        params  = {};
    }

    try {

        params.type = Ti.UI.PICKER_TYPE_DATE;

        var picker  = Piwik.require('UI/DatePicker');

        picker.setParams(params);

        return picker.init(params);
        
    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiDp16'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new TableViewRow.
 *
 * @see Piwik.UI.TableViewRow
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.TableViewRow.
 *
 * @type Titanium.UI.TableViewRow
 *
 * @returns The created row.
 */
Piwik.UI.createTableViewRow = function (params) {

    try {
        var instance = Piwik.require('UI/TableViewRow');

        return instance.init(params);

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiTr11'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new TableViewSection.
 *
 * @see Piwik.UI.TableViewSection
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.TableViewSection.
 *
 * @type Titanium.UI.TableViewSection
 *
 * @returns The created section.
 */
Piwik.UI.createTableViewSection = function (params) {

    try {
        var instance = Piwik.require('UI/TableViewSection');

        return instance.init(params);

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiTs21'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new activity indicator instance.
 *
 * @see Piwik.UI.ActivityIndicator
 *
 * @type Piwik.UI.ActivityIndicator
 *
 * @returns The created activity indicator instance.
 */
Piwik.UI.createActivityIndicator = function () {

    return Piwik.require('UI/ActivityIndicator');
};

/**
 * Creates a new UI error instance.
 *
 * @see Piwik.UI.Error
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.Error.
 *
 * @type Piwik.UI.Error
 *
 * @returns The created UI error instance.
 */
Piwik.UI.createError = function (params) {

    var instance = Piwik.require('UI/Error');
    instance.setParams(params);
    instance.init();

    return instance;
};

/**
 * Creates a new graph instance.
 *
 * @see Piwik.UI.Graph
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.Graph.
 *
 * @type Piwik.UI.Graph
 *
 * @returns The created graph instance.
 */
Piwik.UI.createGraph = function (params) {

    try {
        var instance = Piwik.require('UI/Graph');
        instance.setParams(params);
        instance.init();

        return instance;

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiCg27'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new statistic list instance.
 *
 * @see Piwik.UI.StatisticList
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.StatisticList.
 *
 * @type Piwik.UI.StatisticList
 *
 * @returns The created statistic list instance.
 */
Piwik.UI.createStatisticList = function (params) {

    try {
        var instance = Piwik.require('UI/StatisticList');
        instance.setParams(params);
        instance.init();

        return instance;

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiSl30'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new header instance.
 *
 * @see Piwik.UI.Header
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.Header.
 *
 * @type Piwik.UI.Header
 *
 * @returns The created header instance.
 */
Piwik.UI.createHeader = function (params) {

    try {
        var header = Piwik.require('UI/Header');
        header.setParams(params);
        header.init();

        return header;
        
    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiCh33'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new menu instance.
 *
 * @see Piwik.UI.Menu
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.Menu.
 *
 * @type Piwik.UI.Menu
 *
 * @returns The created menu instance.
 */
Piwik.UI.createMenu = function (params) {

    try {
        var menu = Piwik.require('UI/Menu');
        menu.setParams(params);
        menu.init();

        return menu;

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiCm35'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new refresh instance.
 *
 * @see Piwik.UI.Refresh
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.Refresh.
 *
 * @type Piwik.UI.Refresh
 *
 * @returns The created refresh instance.
 */
Piwik.UI.createRefresh = function (params) {

    try {
        var instance = Piwik.require('UI/Refresh');
        instance.setParams(params);
        instance.init();

        return instance;

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiCr38'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new visitor overview instance.
 *
 * @see Piwik.UI.VisitorOverview
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.VisitorOverview.
 *
 * @type Piwik.UI.VisitorOverview
 *
 * @returns The created visitor overview instance.
 */
Piwik.UI.createVisitorOverview = function (params) {

    try {
        var instance = Piwik.require('UI/VisitorOverview');
        instance.setParams(params);
        instance.init();

        return instance;

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiVo41'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new visitor instance.
 *
 * @see Piwik.UI.Visitor
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.Visitor.
 *
 * @type Piwik.UI.Visitor
 *
 * @returns The created visitor instance.
 */
Piwik.UI.createVisitor = function (params) {

    try {
        var instance = Piwik.require('UI/Visitor');
        instance.setParams(params);
        instance.init();

        return instance;

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiCv43'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new live overview instance.
 *
 * @see Piwik.UI.LiveOverview
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.LiveOverview.
 *
 * @type Piwik.UI.LiveOverview
 *
 * @returns The created live overview instance.
 */
Piwik.UI.createLiveOverview = function (params) {

    try {
        var instance = Piwik.require('UI/LiveOverview');
        instance.setParams(params);
        instance.init();

        return instance;

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiLo46'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new website list instance.
 *
 * @see Piwik.UI.WebsiteList
 *
 * @param   {Object} params      A dictionary object properties defined in Piwik.UI.WebsiteList.
 *
 * @type Piwik.UI.WebsiteList
 *
 * @returns The created website list instance.
 */
Piwik.UI.createWebsitesList = function (params) {

    try {
        var instance = Piwik.require('UI/WebsitesList');
        instance.setParams(params);
        instance.init();

        return instance;

    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiUiWl48'});
        uiError.showErrorMessageToUser();
    }
};

/**
 * Creates a new iPad Popover widget.
 *
 * @param   {Object} params      A dictionary object properties defined in Titanium.UI.iPad.Popover.
 *
 * @type Titanium.UI.iPad.Popover
 *
 * @returns The created popover instance.
 */
Piwik.UI.createPopover = function (params) {
    if (this.popover && this.popover.hide) {
        this.popover.hide();
    }
    
    this.popover = Ti.UI.iPad.createPopover(params);
    
    return this.popover;
};
