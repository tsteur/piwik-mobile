#!/bin/bash
#
# Create a build file of the current trunk. It will create a file named "Piwik Mobile.apk" in the defined distribution location.
#
# Usage:
# createnightbuild.sh <path_to_titanium_sdk> <path_to_androidsdk> <path_to_project_trunk> <location_of_android_keystore_file> <keystore_password> <keystore_alias> <distribution_location>
#
# Example:
# ./createnightlybuild.sh /home/user/.titanium/mobilesdk /opt/android-sdk /home/user/piwik/svn/mobile/trunk /home/user/piwik/android.keystore "secret" "alias" /home/user/desktop
# 
# Link: http://piwik.org
# License: http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later

if [ $# -ne 7 ] 
then
    echo "Not correct number of parameters."
    echo "Usage: createnightbuild.sh <path_to_titanium_sdk> <path_to_androidsdk> <path_to_project_trunk> <location_of_android_keystore_file> <keystore_password> <keystore_alias> <distribution_location>"
    exit 1
fi

echo "updating languages"
./updatelanguagefiles.py 

PATH_TITANIUM_SDK=$1
PATH_ANDROID_SDK=$2
PATH_PROJECT_TRUNK=$3
KEYSTORE_FILE=$4
KEYSTORE_PASSWORD=$5
KEYSTORE_ALIAS=$6
BUILD_TARGET=$7

echo "create nightly build"
$PATH_TITANIUM_SDK/linux/1.7.0/android/builder.py distribute "Piwik Mobile" $PATH_ANDROID_SDK $PATH_PROJECT_TRUNK "org.piwik.mobile" $KEYSTORE_FILE $KEYSTORE_PASSWORD $KEYSTORE_ALIAS $BUILD_TARGET 4
