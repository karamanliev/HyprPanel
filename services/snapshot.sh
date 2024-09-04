#!/usr/bin/env bash

mode=${1:-area}

case "$mode" in
window)
    command="hyprshot -m window --raw --clipboard-only | satty -f -"
    ;;
output)
    command="hyprshot -m output --raw --clipboard-only | satty -f -"
    ;;
area)
    command="hyprshot -m region --raw --clipboard-only | satty -f -"
    ;;
*)
    echo "Invalid option: $mode"
    echo "Usage: $0 {window|output|area}"
    exit 1
    ;;
esac

eval "$command"
