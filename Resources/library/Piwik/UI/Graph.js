/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/** @private */
var Piwik = require('library/Piwik');

/**
 * @class     A graph is created by the method Piwik.UI.createGraph. The graph UI widget displays a rendered graph.
 *            The graph will be rendered into a TableViewRow. Therefore, you need a TableView to display the rendered
 *            content. The rendered row is accessible via getRow(). Does automatically display an information that
 *            no data is available if graphUrl is not defined.
 *
 * @param     {Object}  [params]           See {@link Piwik.UI.View#setParams}
 * @param     {string}  [params.graphUrl]  Optional. The url to the graph without any sizes
 *
 * @example
 * var graph = Piwik.getUI().createGraph({graphUrl: 'http://...'});
 * var row   = graph.getRow();
 * 
 * @exports   Graph as Piwik.UI.Graph
 * @augments  Piwik.UI.View
 */
function Graph () {
}

/**
 * Extend Piwik.UI.View
 */
Graph.prototype = Piwik.require('UI/View');

/**
 * Initializes and renders the graph UI widget.
 *
 * @returns  {Piwik.UI.Graph}  An instance of the current state.
 */
Graph.prototype.init = function () {

    var graphUrl = this.getParam('graphUrl', '');
    
    if (!graphUrl) {
        Piwik.getLog().debug('No graphUrl given', 'Piwik.UI.Graph::init');

        var _    = require('library/underscore');
        this.row = Ti.UI.createTableViewRow({className: 'noDataForGraphTableViewRow',
                                             title: _('General_NoDataForGraph')});
        
        return this;
    }
    
    var view = Ti.UI.createTableViewRow({className: 'graphTableViewRow'});

    this.addGraph(view);

    this.row = view;
    view     = null;
    
    return this;
};

/**
 * Get the rendered content/row of the graph.
 * 
 * @type  Titanium.UI.TableViewRow
 */
Graph.prototype.getRow = function () {
    var row  = this.row;
    this.row = null;
    
    return row;
};

/**
 * Creates an image view to display the graph and adds it to the given view.
 *
 * @param  {Titanium.UI.View}  view  Any Titanium.UI.View object - for example Titanium.UI.TableViewRow where
 *                                   the graph image should be rendered into.
 */
Graph.prototype.addGraph = function (view) {
    // @todo can we calculate the width depending on the outer view? width is only correct under circumstances.
    var width = Piwik.getUI().currentWindow.width;
    if (!width && Piwik.getUI().currentWindow.size) {
        width = Piwik.getUI().currentWindow.size.width;
    }

    var width        = parseInt(width, 10) - 2 - 40;
    var height       = 150;

    var graphUrl     = this.getParam('graphUrl', '');
    var graph        = this.getParam('graph');
    var fullGraphUrl = graph.appendSize(graphUrl, width, height, !Piwik.getPlatform().isAndroid);
    
    Piwik.getLog().debug(fullGraphUrl, 'Piwik.UI.Graph::addGraph');

    width  = ('' + width);
    height = ('' + height);
    
    var graphImage = Ti.UI.createImageView({width: width,
                                            height: height,
                                            id: 'graphImage', 
                                            hires: true,
                                            image: fullGraphUrl});

    view.add(graphImage);
    graphImage = null;
    
    if (!Piwik.getPlatform().isIpad) {
        
        var showDetailImage = Ti.UI.createImageView({className: 'graphShowDetailImage'});
        
        var that = this;
        // event to open graph in fullscreen
        showDetailImage.addEventListener('click', function () {
            that.create('Window', {url: 'graph/fulldetail',
                                   target: 'modal',
                                   graphUrl: graphUrl});
        });
        
        view.add(showDetailImage);
        showDetailImage = null;
    }
    
};

module.exports = Graph;