#!/usr/bin/env bash

tmux split-window yarn start:ui && \
  yarn start:server
