#!/bin/bash
ganache-cli --host 0.0.0.0 &
echo 'entrypoint.sh';
exec "$@"