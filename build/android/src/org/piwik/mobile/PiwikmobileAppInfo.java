package org.piwik.mobile;

import org.appcelerator.titanium.ITiAppInfo;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiProperties;
import org.appcelerator.titanium.util.Log;

/* GENERATED CODE
 * Warning - this class was generated from your application's tiapp.xml
 * Any changes you make here will be overwritten
 */
public class PiwikmobileAppInfo implements ITiAppInfo
{
	private static final String LCAT = "AppInfo";
	
	
	public PiwikmobileAppInfo(TiApplication app) {
		TiProperties properties = app.getSystemProperties();
					
		properties.setString("ti.deploytype", "test");
	}
	
	public String getId() {
		return "org.piwik.mobile";
	}
	
	public String getName() {
		return "PiwikMobile";
	}
	
	public String getVersion() {
		return "1.0";
	}
	
	public String getPublisher() {
		return "User";
	}
	
	public String getUrl() {
		return "http://piwik.org";
	}
	
	public String getCopyright() {
		return "2010 by User";
	}
	
	public String getDescription() {
		return "No description provided";
	}
	
	public String getIcon() {
		return "default_app_logo.png";
	}
	
	public boolean isAnalyticsEnabled() {
		return true;
	}
	
	public String getGUID() {
		return "e0134140-a395-46b8-8f20-31172990b391";
	}
	
	public boolean isFullscreen() {
		return false;
	}
	
	public boolean isNavBarHidden() {
		return false;
	}
}
