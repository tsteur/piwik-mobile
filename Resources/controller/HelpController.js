/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    Provides help related stuff.
 *              
 * @augments ActionController
 */
function HelpController () {

    /**
     * About action. Mainly license and copyright specific stuff.
     *
     * @type null 
     */
    this.aboutAction = function () {

        this.render('about');
    };   
    
    /**
     * Feedback action. Get feedback, report a bug or a feature request.
     *
     * @type null 
     */
    this.feedbackAction = function () {

        this.render('feedback');
    };
}

HelpController.prototype = new ActionController();
