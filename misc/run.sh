#!/bin/bash
export LD_LIBRARY_PATH="../libs/:$LD_LIBRARY_PATH"
../libs/pypy/bin/pypy ../libs/skeinforge/skeinforge_application/skeinforge.py -p "$1" "$2" > "$3"; echo $! > "$4"
echo end
