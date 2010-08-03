//
//  Appcelerator Titanium Mobile
//  WARNING: this is a generated file and should not be modified
//

#import <UIKit/UIKit.h>
#define _QUOTEME(x) #x
#define STRING(x) _QUOTEME(x)

NSString * const TI_APPLICATION_DEPLOYTYPE = @"production";
NSString * const TI_APPLICATION_ID = @"org.piwik.mobile";
NSString * const TI_APPLICATION_PUBLISHER = @"Piwik.org";
NSString * const TI_APPLICATION_URL = @"http://piwik.org";
NSString * const TI_APPLICATION_NAME = @"PiwikMobile";
NSString * const TI_APPLICATION_VERSION = @"1.0";
NSString * const TI_APPLICATION_DESCRIPTION = @"Piwik is a downloadable, open source (GPL licensed) real time web analytics software program. It provides you with detailed reports on your website visitors: the search engines and keywords they used, the language they speak, your popular pages... and so much more. Piwik aims to be an open source alternative to Google Analytics. You can access these reports by using this mobile client.";
NSString * const TI_APPLICATION_COPYRIGHT = @"2010 by Piwik.org";
NSString * const TI_APPLICATION_GUID = @"e0134140-a395-46b8-8f20-31172990b391";
BOOL const TI_APPLICATION_ANALYTICS = false;

#ifdef TARGET_IPHONE_SIMULATOR
NSString * const TI_APPLICATION_RESOURCE_DIR = @"";
#endif

int main(int argc, char *argv[]) {
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];

#ifdef __LOG__ID__
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
	NSString *documentsDirectory = [paths objectAtIndex:0];
	NSString *logPath = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%s.log",STRING(__LOG__ID__)]];
	freopen([logPath cStringUsingEncoding:NSUTF8StringEncoding],"w+",stderr);
	fprintf(stderr,"[INFO] Application started\n");
#endif

	int retVal = UIApplicationMain(argc, argv, nil, @"TiApp");
    [pool release];
    return retVal;
}
