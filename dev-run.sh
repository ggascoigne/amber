#!/usr/bin/env bash

if [[ $(docker ps -q | wc -l ) != 0 ]] ; then docker kill `docker ps -q` ; fi

brew services start postgres

tmux split-window yarn start:server && \
  yarn start:client
