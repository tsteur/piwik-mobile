#!/bin/bash

# Prepares the resources of the PiwikMobile app for an upcoming release.
# Shrinks all javascript files and merges some javascript files for less 
# stat calls when running the app. 
#
# Link: http://piwik.org
# License: http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 
for I in `find ../Resources/ -name "*.js" -type f` ; 

 do echo $I;
 java -jar closurecompiler/compiler.jar  --compilation_level SIMPLE_OPTIMIZATIONS --charset utf-8 --define='Log.ENABLED=false' --js $I --js_output_file $I"_minify.js"
 rm $I;
 mv $I"_minify.js" $I;

done

echo '' > ../Resources/library/all.js;

for I in `find ../Resources/library -name "*[!all].js" -type f` ; 

 do cat $I >> ../Resources/library/all.js

done

# TODO delete Resources/default_app_logo.png if exists

# TODO remove android/iphone specific files depending on a parameter
