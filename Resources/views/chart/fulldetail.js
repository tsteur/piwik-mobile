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
    
    var width  = this.size.width - 30;
    var height = this.size.height - 30;
    
    var currentOrientation = Titanium.UI.orientation;

    if (width < height) {

        // current width detected in portrait mode -> we have to switch width/height therefore
        var tempWidth = width;
        width         = height;
        height        = tempWidth;

        Titanium.UI.currentWindow.orientationModes = [Titanium.UI.LANDSCAPE_LEFT,
                                                      Titanium.UI.LANDSCAPE_RIGHT]; 

        Titanium.UI.orientation                    = Titanium.UI.LANDSCAPE_LEFT;
        
    } else {

        Titanium.UI.currentWindow.orientationModes = [Titanium.UI.LANDSCAPE_LEFT,
                                                      Titanium.UI.LANDSCAPE_RIGHT]; 
    }

    this.graphUrl  = Graph.appendSize(this.graphUrl, width, height);
    
    var view = Titanium.UI.createImageView({width:  width,
                                            height: height,
                                            top:    15,
                                            left:   15,
                                            url:    this.graphUrl});
    
    var _this = this;
    
    view.addEventListener('click', function (event) {

        Titanium.UI.currentWindow.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT]; 
        Titanium.UI.orientation                    = Titanium.UI.PORTRAIT;
        
        Window.close(Titanium.UI.currentWindow);
        
    });
    
    this.add(view);
}
