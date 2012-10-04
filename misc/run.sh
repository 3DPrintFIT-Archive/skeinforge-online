#!/bin/bash
python ../libs/skeinforge_application/skeinforge.py -p "$1" "$2" > "$3" 2>&1
echo end
