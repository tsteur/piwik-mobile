/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    View helper which displays a graph.
 *
 * @property {Object}   options           See {@link View_Helper#setOptions}
 * @property {Int}      [options.top=1]   Optional - Top position of the resulting view
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
            
            this.subView = Titanium.UI.createView({
                height: 40,
                top: this.getOption('top', 1),
                left: 1,
                right: 1,
                paddingBottom: 10,
                backgroundColor: config.theme.backgroundColor
            });

            var labelWidth = 'auto';
            if ('android' === Titanium.Platform.osname && 100 < parseInt(this.view.width, 10)) {
                // @todo set this to auto as soon as this bug is completely fixed #wrapbug  
                
                labelWidth = parseInt(this.view.width, 10) - 40;
            }
            
            var noDataInfoLabel = Titanium.UI.createLabel({
                text: _('General_NoDataForGraph'),
                height: 'auto',
                left: 10,
                top: 11,
                width: labelWidth,
                color: config.theme.textColor,
                font: {fontSize: config.theme.fontSizeNormal, fontFamily: config.theme.fontFamily}
            });
       
            var bottomBorderView = Titanium.UI.createView({
                height: 1,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#B8B4AB'
            });
            
            this.subView.add(noDataInfoLabel);            
            this.subView.add(bottomBorderView);
            
            return this;
        }
        
        var view = Titanium.UI.createTableViewRow({height: 165,
                                                   backgroundColor: config.theme.backgroundColor});
    
        this.addGraph(view);

        this.subView = view;
        
        return this;
    };
    
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
    this.addGraph  = function (view) {
    
        // @todo can we calculate the width depending on the outer view? width is only correct under circumstances.
        var width    = parseInt(this.view.width, 10) - 2 - 20;
        var height   = 150;
        
        var graphUrl = this.getOption('graphUrl');
        
        graphUrl     = Graph.appendSize(graphUrl, width, height);
        
        Log.debug(graphUrl, 'graph');
        
        var graph = Titanium.UI.createImageView({width: width,
                                                 height: height,
                                                 top: 4,
                                                 image: graphUrl,
                                                 left: 10,
                                                 zIndex: 1});

        var _this = this;

        var showDetailImage = Ti.UI.createImageView({image: 'images/icon/chart_detail.png', 
                                                     backgroundSelectedColor: '#E7E3D6',
                                                     backgroundFocusedColor: '#E7E3D6',
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
                graphUrl: _this.getOption('graphUrl')
            });
        });
        
        graph.addEventListener('doubletap', function () {
            Window.createMvcWindow({
                jsController: 'chart',
                jsAction: 'fulldetail',
                graphUrl: _this.getOption('graphUrl')
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
