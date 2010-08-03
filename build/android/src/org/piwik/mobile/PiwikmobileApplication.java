package org.piwik.mobile;

import org.appcelerator.titanium.TiApplication;

public class PiwikmobileApplication extends TiApplication {

	@Override
	public void onCreate() {
		super.onCreate();
		
		appInfo = new PiwikmobileAppInfo(this);
	}
}
