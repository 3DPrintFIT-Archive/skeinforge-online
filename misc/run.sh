#!/bin/bash
#../libs/pypy/bin/pypy
python ../libs/skeinforge/skeinforge_application/skeinforge.py -p "$1" "$2" > "$3"; echo $! > "$4"
echo end
