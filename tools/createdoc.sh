#!/bin/bash

# Generates the developer api documentation using jsdoc toolkit.
#
# Link: http://piwik.org
# License: http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later

java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js -r=5 ../Resources -t=jsdoc-toolkit/templates/jsdoc -p -d=../docs --encoding=UTF-8
