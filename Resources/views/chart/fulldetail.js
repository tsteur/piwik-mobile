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
    
    if (pictureWidth < pictureHeight) {
        var tempWidth  = pictureWidth;
        pictureWidth   = pictureHeight;
        pictureHeight  = tempWidth;
    }

    var imageLeftPos   = -45;
    var imageTopPos    = 90;
    if ('ipad' == Ti.Platform.osname) {
        imageLeftPos   = -90;
        imageTopPos    = 140;
    }

    this.graphUrl = Graph.appendSize(this.graphUrl, pictureWidth, pictureHeight);
    Log.debug('graphUrl is ' + this.graphUrl, 'fullDetail');
    
    var imageView = Titanium.UI.createImageView({width:  pictureWidth,
                                                 height: pictureHeight,
                                                 top:    imageTopPos,
                                                 left:   imageLeftPos,
                                                 canScale: true,
                                                 enableZoomControls: false, 
                                                 anchorPoint: {x:0.5,y:0.5},
                                                 image: this.graphUrl});

    // rotate the image
    var imageTransform      = Ti.UI.create2DMatrix();
    imageTransform          = imageTransform.rotate(90);
    var spinAnimation       = Titanium.UI.createAnimation();
    spinAnimation.transform = imageTransform;
    spinAnimation.duration  = 10;

    var closeChartView      = function (event) {
        Window.close();
    };

    Ui_Menu.addItem({title: _('General_Close')}, closeChartView);
    this.addEventListener('click', closeChartView);
    
    this.add(imageView);
    
    imageView.animate(spinAnimation);
}

