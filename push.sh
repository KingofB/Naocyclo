#!/bin/bash

#set -ex
set -e

if [ $# -ne 1 ]; then
	echo "ERROR: please specify the commit comment"
	exit 1
fi

printf "\n####################################"
printf "\n### Trying to update application..."
printf "\n####################################\n"
git add . && git commit -m "$1"
git push
