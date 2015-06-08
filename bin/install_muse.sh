#!/usr/bin/env bash

# Check if muse-io is already installed
type muse-io >/dev/null 2>&1 || {

    # If not, try to install it
    echo >&2 "muse-io binary not found, trying to install it...";
    wget http://storage.googleapis.com/ix_downloads/musesdk-3.4.1/musesdk-3.4.1-linux-installer.run;
    sudo chmod a+x musesdk-3.4.1-linux-installer.run;
    sudo ./musesdk-3.4.1-linux-installer.run;
    rm -rf install.sh;

}