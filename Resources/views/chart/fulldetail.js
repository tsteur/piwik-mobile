/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template chart/fulldetail.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function template () {
    
    var originalWidth  = this.width;
    var originalHeight = this.height;
    var pictureWidth   = originalWidth - 45;
    var pictureHeight  = originalHeight - 45;

    var currentOrientation = Titanium.UI.orientation;

    if (pictureWidth < pictureHeight) {

        // current width detected in portrait mode -> we have to switch width/height therefore
        var tempWidth = pictureWidth;
        pictureWidth  = pictureHeight;
        pictureHeight = tempWidth;

        Titanium.UI.currentWindow.orientationModes = [Titanium.UI.LANDSCAPE_LEFT,
                                                      Titanium.UI.LANDSCAPE_RIGHT]; 

        Titanium.UI.orientation                    = Titanium.UI.LANDSCAPE_LEFT;

        this.width    = originalHeight;
        this.height   = originalWidth;
        
    } else {

        Titanium.UI.currentWindow.orientationModes = [Titanium.UI.LANDSCAPE_LEFT,
                                                      Titanium.UI.LANDSCAPE_RIGHT];
    }

    this.graphUrl = Graph.appendSize(this.graphUrl, pictureWidth, pictureHeight);
    Log.debug('graphUrl is ' + this.graphUrl, 'fullDetail');
    
    var imageView = Titanium.UI.createImageView({width:  pictureWidth,
                                                 height: pictureHeight,
                                                 top:    15,
                                                 left:   15,
                                                 image:  this.graphUrl});

    var closeChartView = function (event) {

        Titanium.UI.currentWindow.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT]; 
        if ('android' !== Titanium.Platform.osname && currentOrientation) {
            Titanium.UI.orientation                = currentOrientation;
        } else {
            Titanium.UI.orientation                = Titanium.UI.PORTRAIT;
        }
        
        Window.close();
    };

    Ui_Menu.addItem({title: _('General_Close')}, closeChartView);
    this.addEventListener('click', closeChartView);
    
    this.add(imageView);
}
