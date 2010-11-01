#!/bin/bash

# Prepares the resources of the PiwikMobile app for an upcoming release.
# Shrinks all javascript files and merges some javascript files for less 
# stat calls when running the app. 
#
# Link: http://piwik.org
# License: http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later

files=$(sed -n "s/Titanium\.include('\(.*\).*');/\1/p" ../Resources/library/all.js)

echo "shrink js files" 
 
for I in `find ../Resources/ -name "*.js" -type f` ; 

 do echo $I;
 java -jar closurecompiler/compiler.jar  --compilation_level SIMPLE_OPTIMIZATIONS --logging_level=1000 --third_party=true --warning_level=quiet --charset utf-8 --define='Log.ENABLED=false' --js $I --js_output_file $I"_minify.js"
 ## --formatting=pretty_print --summary_detail_level 1
 rm $I;
 mv $I"_minify.js" $I;

done

echo "merge following files into all.js"

echo '' > ../Resources/library/all.js;

for file in $files
do 
echo $file
cat ../Resources$file >> ../Resources/library/all.js
done 

echo "removing wrong app logo if exists"

if [ -f ../Resources/default_app_logo.png ];
then
echo "wrong app logo found and deleted"
rm -f ../Resources/default_app_logo.png
fi
