#!/bin/bash

version="$(git branch --show-current)"
git tag -d $version 2>/dev/null
git push origin :refs/tags/$version 2>/dev/null

git tag $version
