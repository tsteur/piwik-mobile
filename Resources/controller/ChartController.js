/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    Chart related stuff. For example display other versions of a chart or in fullscreen.
 *              
 * @augments ActionController
 */
function ChartController () {

    /**
     * Displays a graph in fullscreen size.
     *
     * @param {string} graphUrl  The url of a graph without any size defintion. The size depending on the screen size
     *                           will be appended automatically.
     */
    this.fulldetailAction = function () {
    
        this.view.graphUrl = this.getParam('graphUrl', '');
        
        this.render('fulldetail');
    };
}

ChartController.prototype = new ActionController();
