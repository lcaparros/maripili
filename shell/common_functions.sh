#!/bin/bash

timestamp() {
    date --utc +%FT%T.%3NZ
}

new_log() {
    echo ""
    echo "--------------------------------------------------------------------------------------------"
    echo "$(timestamp)"
}