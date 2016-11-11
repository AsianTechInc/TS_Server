#!/bin/bash

CONTAINER_ID="$(docker run -p 3000:3000 -d 'auth-server')"
[[ ! -z $CONTAINER_ID ]] && docker logs $CONTAINER_ID
