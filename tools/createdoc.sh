#!/bin/bash

# Generates the developer api documentation using jsdoc toolkit.
#
# Link: http://piwik.org
# License: http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later

if [ $# -ne 1 ]
then
    echo "Not correct number of parameters."
    echo "Usage: createdoc.sh <doc_output_path>"
    exit 1
fi

DOC_OUTPUT_PATH=$1

java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js -r=5 ../Resources -t=jsdoc-toolkit/templates/jsdoc -p -d=$DOC_OUTPUT_PATH --encoding=UTF-8
