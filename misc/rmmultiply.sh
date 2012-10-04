#!/bin/bash
grep -v '^Number of' "$1" > "$1"2
mv "$1"2 "$1"
