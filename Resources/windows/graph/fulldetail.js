/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'graph/fulldetail.js' .
 */

/**
 * @class Displays the current graph in full screen on the device.
 *
 * @property {Object}    params
 * @property {string}    params.graphUrl     The graph url without any size parameters
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 * 
 * @todo support orientationchange while this window is opened
 */
function window (params) {

    if (!params) {

        return;
    }

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('General_Details')};
    
    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {closeWindow: true};

    var graphUrl      = params.graphUrl;

    if (!graphUrl) {
        // a graphurl is required.

        // @todo close this window or display an info message in such a case?

        return;
    }
    
    var originalWidth  = this.width;
    var originalHeight = this.height;

    var isPortrait     = (originalWidth < originalHeight);

    var pictureWidth   = originalWidth - 20;
    var pictureHeight  = originalHeight - 20;
    
    if (isPortrait) {
        // change width/height cause we are in portrait mode, we'll rotate the image later
        var tempWidth  = pictureWidth;
        pictureWidth   = pictureHeight;
        pictureHeight  = tempWidth;
    }

    var graph     = Piwik.require('Graph');
    graphUrl      = graph.appendSize(graphUrl, pictureWidth, pictureHeight);
    
    Piwik.Log.debug('graphUrl is ' + graphUrl, 'graph/fulldetail::window');

    // canScale: true is important for iPhone Retina display, anchorPoint is important cause otherwise the rotation of
    // the image will not work correctly.
    var imageView = Ti.UI.createImageView({width:  pictureWidth,
                                           height: pictureHeight,
                                           canScale: true,
                                           enableZoomControls: false,
                                           anchorPoint: {x: 0.5, y: 0.5},
                                           image: graphUrl});

    this.add(imageView);
    
    if (isPortrait) {

        // rotate the image
        var imageTransform      = Ti.UI.create2DMatrix();
        imageTransform          = imageTransform.rotate(90);
        var spinAnimation       = Ti.UI.createAnimation();
        spinAnimation.transform = imageTransform;
        spinAnimation.duration  = 10;

        imageView.animate(spinAnimation);
    }

    this.open = function () {
    };
}