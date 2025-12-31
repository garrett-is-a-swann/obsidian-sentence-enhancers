#!/bin/bash

FILE="$1"

[ -f "$FILE" ] && [ -s "$FILE" ] && printf $FILE
