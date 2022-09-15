#!/bin/bash
npm install
ganache-cli --host 0.0.0.0 --deterministic &
echo 'entrypoint.sh';
exec "$@"