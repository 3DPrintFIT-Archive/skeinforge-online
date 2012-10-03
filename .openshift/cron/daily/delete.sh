#!/bin/bash
userid=`whoami`
find /var/lib/stickshift/$userid/app-root/runtime/repo/php/files -mtime +1 -delete
