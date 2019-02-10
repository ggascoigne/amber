#!/usr/bin/env bash

tmux split-window yarn start:server && \
  yarn start:ui
