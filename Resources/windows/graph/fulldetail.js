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
    this.menuOptions  = {};

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

    var graph          = Piwik.require('Graph');
    
    if (isPortrait) {
        graphUrl      = graph.appendSize(graphUrl, pictureHeight, pictureWidth);
    } else {
        graphUrl      = graph.appendSize(graphUrl, pictureWidth, pictureHeight);
    }

    Piwik.Log.debug('graphUrl is ' + graphUrl, 'graph/fulldetail::window');

    var imageView = Ti.UI.createImageView({width: Piwik.isIphone ? pictureWidth : 'auto',
                                           height:  Piwik.isIphone ? pictureHeight : 'auto',
                                           canScale: true,
                                           enableZoomControls: false,
                                           image: graphUrl});

    this.add(imageView);

    this.open = function () {
    };
}