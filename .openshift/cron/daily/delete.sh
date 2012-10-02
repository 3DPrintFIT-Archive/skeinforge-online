#!/bin/bash
userid=`whoami`
find cd /var/lib/stickshift/$userid/app-root/runtime/repo/php/files -type f -mtime +1 -delete
