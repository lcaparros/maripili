#!/bin/bash

base=$(dirname "$0")

test_f() {
    fild=$(echo "$@"| sed 's^ ^\|^g')
    echo $fild
    if cat resources/insultos.txt | grep -iqE "$fild"; then
        echo "$(cat $base/resources/bocasucia.txt | head -n $(shuf -i 1-8 -n 1) | tail -n 1)"
    else
        echo "Oh noo!"
    fi
}

test_f $@