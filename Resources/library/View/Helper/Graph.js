/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    View helper which displays a graph. This helper renderes its content into a TableViewRow. 
 *           You need a TableView therefore to display the rendered content.
 *
 * @property {Object}   options           See {@link View_Helper#setOptions}
 * @property {string}   [options.title]   Optional - The title of the graph
 * @property {string}   options.graphUrl  The url to the graph without any sizes
 * 
 * @augments View_Helper
 */
function View_Helper_Graph () {

    /**
     * Creates the 'subView' container and arranges the addition of the title and graph.
     *
     * @returns {View_Helper_Graph} An instance of the current state.
     */
    this.direct  = function () {

        var graphUrl = this.getOption('graphUrl', '');
        
        if (!graphUrl) {
            Log.debug('No graphUrl given', 'graphHelper');
 
            this.subView = Ti.UI.createTableViewRow({height: 40, 
                                                     title: _('General_NoDataForGraph'),
                                                     left: 10,
                                                     color: config.theme.textColor,
                                                     font: {fontSize: config.theme.fontSizeNormal, 
                                                            fontFamily: config.theme.fontFamily},
                                                     width: parseInt(this.view.width, 10)});
            
            return this;
        }
        
        var view = Titanium.UI.createTableViewRow({height: 165,
                                                   backgroundColor: config.theme.backgroundColor});

        this.addGraph(view);

        this.subView = view;
        
        return this;
    };
    
    /**
     * Get the rendered content of this graph.
     * 
     * @returns Titanium.UI.TableViewRow
     */
    this.getRow = function () {
        
        return this.subView;
    };

    /**
     * Adds the graph part.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addGraph    = function (view) {
    
        // @todo can we calculate the width depending on the outer view? width is only correct under circumstances.
        var width        = parseInt(this.view.width, 10) - 2 - 20;
        var height       = 150;
        
        var graphUrl     = this.getOption('graphUrl', '');
        
        var fullGraphUrl = Graph.appendSize(graphUrl, width, height);
        
        Log.debug(fullGraphUrl, 'graph');
        
        var graph = Titanium.UI.createImageView({width: width,
                                                 height: height,
                                                 top: 4,
                                                 image: fullGraphUrl,
                                                 left: 10,
                                                 zIndex: 1});

        var showDetailImage = Ti.UI.createImageView({image: 'images/icon/chart_detail.png', 
                                                     backgroundSelectedColor: '#FFC700',
                                                     backgroundFocusedColor: '#FFC700',
                                                     backgroundColor: '#ffffff',
                                                     focusable: true,
                                                     bottom: 8, 
                                                     right: 8, 
                                                     width: 29, 
                                                     height: 29,
                                                     zIndex: 2});
        
        // event to open graph in fullscreen
        showDetailImage.addEventListener('click', function () {
            Window.createMvcWindow({
                jsController: 'chart',
                jsAction: 'fulldetail',
                graphUrl: graphUrl
            });
        });
        
        graph.addEventListener('doubletap', function () {
            Window.createMvcWindow({
                jsController: 'chart',
                jsAction: 'fulldetail',
                graphUrl: graphUrl
            });
        });
        
        view.add(graph);
        view.add(showDetailImage);
    };
}

/**
 * Extend View_Helper
 */
View_Helper_Graph.prototype = new View_Helper();
