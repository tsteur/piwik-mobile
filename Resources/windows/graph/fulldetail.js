/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'graph/fulldetail.js' .
 */

/** @private */
var Piwik = require('library/Piwik');
/** @private */
var _     = require('library/underscore');

/**
 * @class     Displays the current graph in full screen on the device.
 *
 * @property  {Object}  params
 * @property  {string}  params.graphUrl  The graph url without any size parameters
 *
 * @exports   window as WindowGraphFulldetail
 * @this      Piwik.UI.Window
 * @augments  Piwik.UI.Window
 */
function window (params) {

    if (!params) {

        return;
    }

    /**
     * @see  Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('General_Details')};
    
    /**
     * @see  Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};

    var graphUrl      = params.graphUrl;

    if (!graphUrl) {
        // a graphurl is required.

        // @todo close this window or display an info message in such a case?

        return;
    }
    
    var originalWidth  = this.width;
    var originalHeight = this.height;
    
    var isLandscape    = (originalWidth > originalHeight);
    var navBarHeight   = Ti.Platform.displayCaps.platformHeight - originalHeight;
    
    if (0 > navBarHeight) {
        navBarHeight   = 0;
    }

    var pictureWidth   = originalWidth - 20;
    var pictureHeight  = originalHeight - 20;
    
    var graph          = Piwik.require('PiwikGraph');
    var imageView      = null;

    // fixme display graph in portrait mode and then rotating screen causes graph is not fully displayed
    graphUrlWithSize   = graph.appendSize(graphUrl, pictureWidth, pictureHeight, true);
    graphUrlWithSize   = graph.setParams(graphUrlWithSize, {showMetricTitle: 1});

    Piwik.getLog().debug('piwik graphUrl is ' + graphUrlWithSize, 'graph/fulldetail::window');

    imageView = Ti.UI.createImageView({width: pictureWidth,
                                       height:  pictureHeight,
                                       canScale: !Piwik.getPlatform().isAndroid,
                                       hires: !Piwik.getPlatform().isAndroid,
                                       enableZoomControls: false,
                                       className: 'fullgraphImage',
                                       image: graphUrlWithSize});

    this.add(imageView);
    
    var that = this;
    
    function rotateImageOnAndroid (event) {
        if (!imageView || !that || !event) {
            
            return;
        }
        
        try {
            // we have to detect current width/height after orientation change... that.width/that.height is not correct
            if (Ti.Gesture.isLandscape(event.orientation)) {
                if (isLandscape) {
                    pictureWidth  = originalWidth - 20;
                    pictureHeight = originalHeight - 20;
                } else {
                    pictureWidth  = originalHeight;
                    pictureHeight = originalWidth - navBarHeight - 40;
                }
            } else {
                if (isLandscape) {
                    pictureWidth  = originalHeight;
                    pictureHeight = originalWidth - navBarHeight - 40;
                } else {
                    pictureWidth  = originalWidth - 20;
                    pictureHeight = originalHeight - 20;
                }
            }
            
            that.remove(imageView);
            imageView        = null;

            graphUrlWithSize = graph.appendSize(graphUrl, pictureWidth, pictureHeight, true);
            graphUrlWithSize = graph.setParams(graphUrlWithSize, {showMetricTitle: 1});
            imageView        = Ti.UI.createImageView({width: pictureWidth,
                                                      height:  pictureHeight,
                                                      canScale: !Piwik.getPlatform().isAndroid,
                                                      hires: !Piwik.getPlatform().isAndroid,
                                                      defaultImage: '/images/graphDefault.png',
                                                      enableZoomControls: false,
                                                      image: graphUrlWithSize});
            that.add(imageView);
        } catch (e) {
            Piwik.getLog().warn('Failed to update (remove and add) graph', 'graph/fulldetail::window');
            Piwik.getLog().warn(e, 'graph/fulldetail::window');
        }
    }
        
    function rotateImage (event) {
        if (!imageView || !that) {
            
            return;
        }
        
        pictureWidth     = that.width - 20;
        pictureHeight    = that.height - 20;
        
        imageView.width  = pictureWidth;
        imageView.height = pictureHeight;
        graphUrlWithSize = graph.appendSize(graphUrl, pictureWidth, pictureHeight, true);
        graphUrlWithSize = graph.setParams(graphUrlWithSize, {showMetricTitle: 1});
    
        imageView.image  = graphUrlWithSize;
    }
    
    Ti.Gesture.addEventListener('orientationchange', Piwik.getPlatform().isAndroid ? rotateImageOnAndroid : rotateImage);
    this.addEventListener('blurWindow', function () {
        try {
            Ti.Gesture.removeEventListener('orientationchange', Piwik.getPlatform().isAndroid ? rotateImageOnAndroid : rotateImage);
        } catch (e) {
            Piwik.getLog().warn('Failed to remove orientationchange event listener', 'graph/fulldetail::window');
            Piwik.getLog().warn(e, 'graph/fulldetail::window');
        }
    });
    
    this.open = function () {
    };
    
    this.cleanup = function () {
        this.remove(imageView);
        imageView         = null;

        graph             = null;
        that              = null;
        this.menuOptions  = null;
        this.titleOptions = null;
    };
}

module.exports = window;